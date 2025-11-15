import request from 'supertest';
import { app, ready } from '../../backend/src/app';
import bcrypt from 'bcryptjs';
import sequelize from '../../backend/src/config/database';

async function login(email: string, password: string) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body?.token as string;
}

describe('CMS API Endpoints', () => {
  let ownerToken = '';
  let editorToken = '';
  let ownerId = '';

  beforeAll(async () => {
    await ready();
    // Ensure admin exists (seed likely did this)
    const adminEmail = 'admin@pressup.com';
    const pw = 'admin123';
    const existing: any = await sequelize.query(`SELECT id FROM users WHERE email = :email`, { type: 'SELECT' as any, replacements: { email: adminEmail } });
    if (!existing[0]) {
      const hash = await bcrypt.hash(pw, 10);
      await sequelize.query(`INSERT INTO users (email, password_hash, name, status) VALUES (:email, :hash, 'Admin User', 'active')`, { type: 'INSERT' as any, replacements: { email: adminEmail, hash } });
    }
    const ownerRes: any = await sequelize.query(`SELECT id, role FROM users ORDER BY created_at ASC LIMIT 1`, { type: 'SELECT' as any });
    ownerId = ownerRes[0].id;
    // Promote to owner for RBAC tests
    await sequelize.query(`UPDATE users SET role = 'owner' WHERE id = :id`, { type: 'UPDATE' as any, replacements: { id: ownerId } });
    ownerToken = await login(adminEmail, pw);

    // Create an editor for RBAC checks (if not exists)
    const editorEmail = 'editor@example.com';
    const ex2: any = await sequelize.query(`SELECT id FROM users WHERE email = :email`, { type: 'SELECT' as any, replacements: { email: editorEmail } });
    if (!ex2[0]) {
      const hash = await bcrypt.hash('editor123', 10);
      await sequelize.query(`INSERT INTO users (email, password_hash, name, status, role) VALUES (:email, :hash, 'Editor User', 'active', 'editor')`, { type: 'INSERT' as any, replacements: { email: editorEmail, hash } });
    }
    editorToken = await login(editorEmail, 'editor123');
  }, 30000);

  it('GET /api/posts should return 200 and data array', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body?.data)).toBeTruthy();
  });

  it('Posts CRUD: create, update, delete', async () => {
    // fetch a user id to set as author
    const users = await request(app).get('/api/users').set('Authorization', `Bearer ${ownerToken}`);
    expect(users.status).toBe(200);
    const authorId = users.body?.data?.[0]?.id;
    // create
    const createRes = await request(app).post('/api/posts').set('Authorization', `Bearer ${ownerToken}`).send({ title: 'Test Post', slug: 'test-post-api', excerpt: 'x', content: { doc: [] }, author_id: authorId, status: 'draft' });
    expect(createRes.status).toBe(201);
    const postId = createRes.body?.id;
    // update
    const updateRes = await request(app).patch(`/api/posts/${postId}`).set('Authorization', `Bearer ${ownerToken}`).send({ title: 'Updated Post', status: 'published' });
    expect(updateRes.status).toBe(200);
    // delete
    const delRes = await request(app).delete(`/api/posts/${postId}`).set('Authorization', `Bearer ${ownerToken}`);
    expect(delRes.status).toBe(200);
  });

  it('Products: GET endpoints respond 200', async () => {
    const products = await request(app).get('/api/products');
    expect(products.status).toBe(200);
    const categories = await request(app).get('/api/products/categories');
    expect(categories.status).toBe(200);
    const brands = await request(app).get('/api/brands');
    expect(brands.status).toBe(200);
  });

  it('Media: upload compresses to <100KB', async () => {
    // Make a tiny red PNG buffer
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AArgB1S3jW6kAAAAASUVORK5CYII=';
    const buf = Buffer.from(pngBase64, 'base64');
    const upload = await request(app)
      .post('/api/assets/upload')
      .set('Authorization', `Bearer ${ownerToken}`)
      .attach('file', buf, 'tiny.png');
    expect([200,201].includes(upload.status)).toBeTruthy();
    const asset = upload.body?.data || upload.body; // support both shapes
    expect(asset?.url).toBeTruthy();
    const urlPath = new URL('http://localhost:3011' + asset.url).pathname; // translate to app static path
    const fileRes = await request(app).get(urlPath);
    const size = parseInt(fileRes.headers['content-length'] || '0', 10);
    expect(size).toBeGreaterThan(0);
    expect(size).toBeLessThanOrEqual(102400);
  });

  it('Users RBAC: owner can create, editor cannot', async () => {
    const email = `u${Date.now()}@example.com`;
    const ownerCreate = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'User A', email, password: 'password123', role: 'author' });
    expect(ownerCreate.status).toBe(201);

    const editorTry = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'User B', email: `x${email}`, password: 'password123', role: 'author' });
    expect(editorTry.status).toBe(403);
  });

  it('Settings: save and reflect, reset defaults', async () => {
    const general = { siteName: 'QA Site', adminEmail: 'qa@example.com', siteUrl: 'https://qa.local', siteDescription: 'QA Desc', businessInfo: { company: 'QA Co' }, socialLinks: { facebook: 'https://fb.com/qa' } };
    const save = await request(app).put('/api/settings/general').set('Authorization', `Bearer ${ownerToken}`).send(general);
    expect(save.status).toBe(200);
    const read = await request(app).get('/api/settings/general').set('Authorization', `Bearer ${ownerToken}`);
    expect(read.status).toBe(200);
    expect(read.body?.value?.siteName).toBe('QA Site');

    const reset = await request(app).post('/api/settings/reset-default').set('Authorization', `Bearer ${ownerToken}`).send({ scope: 'appearance' });
    expect(reset.status).toBe(200);
    const readAppearance = await request(app).get('/api/settings/appearance').set('Authorization', `Bearer ${ownerToken}`);
    expect(readAppearance.status).toBe(200);
    expect(readAppearance.body?.value?.primaryColor).toBeTruthy();
  });
});
