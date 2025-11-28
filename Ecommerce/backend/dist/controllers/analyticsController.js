"use strict";
// Analytics Controller
// Self-hosted analytics tracking and reporting
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealtimeStats = exports.getAnalyticsStats = exports.trackPageview = void 0;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Helper: Simple User Agent Parser
function parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase();
    // Detect browser
    let browser = 'Unknown';
    let browser_version = '';
    if (ua.includes('chrome') && !ua.includes('edge')) {
        browser = 'Chrome';
        const match = ua.match(/chrome\/(\d+)/);
        browser_version = match ? match[1] : '';
    }
    else if (ua.includes('firefox')) {
        browser = 'Firefox';
        const match = ua.match(/firefox\/(\d+)/);
        browser_version = match ? match[1] : '';
    }
    else if (ua.includes('safari') && !ua.includes('chrome')) {
        browser = 'Safari';
        const match = ua.match(/version\/(\d+)/);
        browser_version = match ? match[1] : '';
    }
    else if (ua.includes('edge')) {
        browser = 'Edge';
        const match = ua.match(/edge\/(\d+)/);
        browser_version = match ? match[1] : '';
    }
    // Detect OS
    let os = 'Unknown';
    let os_version = '';
    if (ua.includes('windows')) {
        os = 'Windows';
        if (ua.includes('windows nt 10'))
            os_version = '10';
        else if (ua.includes('windows nt 11'))
            os_version = '11';
    }
    else if (ua.includes('mac')) {
        os = 'macOS';
    }
    else if (ua.includes('android')) {
        os = 'Android';
        const match = ua.match(/android (\d+)/);
        os_version = match ? match[1] : '';
    }
    else if (ua.includes('iphone') || ua.includes('ipad')) {
        os = ua.includes('ipad') ? 'iOS (iPad)' : 'iOS (iPhone)';
    }
    else if (ua.includes('linux')) {
        os = 'Linux';
    }
    // Detect device type
    let device_type = 'desktop';
    if (ua.includes('mobile') || ua.includes('android') && !ua.includes('tablet')) {
        device_type = 'mobile';
    }
    else if (ua.includes('tablet') || ua.includes('ipad')) {
        device_type = 'tablet';
    }
    return { browser, browser_version, os, os_version, device_type };
}
// Helper: Determine traffic source
function determineTrafficSource(referrer, utmSource) {
    if (utmSource) {
        if (utmSource.includes('google') || utmSource.includes('bing'))
            return 'organic';
        if (utmSource.includes('facebook') || utmSource.includes('instagram') || utmSource.includes('twitter'))
            return 'social';
        if (utmSource.includes('email') || utmSource.includes('newsletter'))
            return 'email';
        return 'paid';
    }
    if (!referrer || referrer === '')
        return 'direct';
    const ref = referrer.toLowerCase();
    if (ref.includes('google.com') || ref.includes('bing.com') || ref.includes('duckduckgo.com'))
        return 'organic';
    if (ref.includes('facebook.com') || ref.includes('instagram.com') || ref.includes('twitter.com') || ref.includes('linkedin.com'))
        return 'social';
    return 'referral';
}
// Track Pageview (Public endpoint)
const trackPageview = async (req, res) => {
    try {
        console.log('[Analytics] Received tracking request:', {
            origin: req.headers.origin,
            method: req.method,
            path: req.path,
            hasBody: !!req.body,
            page_path: req.body?.page_path,
        });
        const { page_url, page_title, page_path, referrer, visitor_id, session_id, user_agent, screen_width, screen_height, viewport_width, viewport_height, utm_source, utm_medium, utm_campaign, utm_term, utm_content, time_on_page, } = req.body;
        // Validation
        if (!page_url || !visitor_id || !session_id) {
            return res.status(400).json({
                success: false,
                error: 'page_url, visitor_id, and session_id are required',
            });
        }
        // Parse user agent
        const ua = user_agent || req.headers['user-agent'] || '';
        const parsedUA = parseUserAgent(ua);
        // Get IP address
        const ip_address = req.headers['x-forwarded-for']?.split(',')[0]
            || req.headers['x-real-ip']
            || req.socket.remoteAddress
            || '';
        // Determine traffic source
        const traffic_source = determineTrafficSource(referrer, utm_source);
        // Insert event
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO analytics_events (
        id, event_type, page_url, page_title, page_path, referrer,
        visitor_id, session_id, user_agent, browser, browser_version,
        os, os_version, device_type, ip_address, screen_width, screen_height,
        viewport_width, viewport_height, utm_source, utm_medium, utm_campaign,
        utm_term, utm_content, traffic_source, time_on_page, is_bounce
      ) VALUES (
        :id, 'pageview', :page_url, :page_title, :page_path, :referrer,
        :visitor_id, :session_id, :user_agent, :browser, :browser_version,
        :os, :os_version, :device_type, :ip_address, :screen_width, :screen_height,
        :viewport_width, :viewport_height, :utm_source, :utm_medium, :utm_campaign,
        :utm_term, :utm_content, :traffic_source, :time_on_page, FALSE
      )
      RETURNING id, created_at
    `;
        const result = await database_1.default.query(query, {
            replacements: {
                id,
                page_url,
                page_title: page_title || null,
                page_path: page_path || new URL(page_url).pathname,
                referrer: referrer || null,
                visitor_id,
                session_id,
                user_agent: ua || null,
                browser: parsedUA.browser,
                browser_version: parsedUA.browser_version || null,
                os: parsedUA.os,
                os_version: parsedUA.os_version || null,
                device_type: parsedUA.device_type,
                ip_address: ip_address || null,
                screen_width: screen_width || null,
                screen_height: screen_height || null,
                viewport_width: viewport_width || null,
                viewport_height: viewport_height || null,
                utm_source: utm_source || null,
                utm_medium: utm_medium || null,
                utm_campaign: utm_campaign || null,
                utm_term: utm_term || null,
                utm_content: utm_content || null,
                traffic_source,
                time_on_page: time_on_page || null,
            },
            type: sequelize_1.QueryTypes.INSERT,
        });
        console.log('[Analytics] Successfully tracked pageview:', {
            id,
            page_path: page_path || new URL(page_url).pathname,
            visitor_id: visitor_id?.substring(0, 20) + '...',
        });
        res.status(201).json({ success: true, id });
    }
    catch (error) {
        console.error('Failed to track pageview:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to track pageview',
            details: error.message,
        });
    }
};
exports.trackPageview = trackPageview;
// Get Analytics Stats (Admin only)
const getAnalyticsStats = async (req, res) => {
    try {
        const { start_date, end_date, period = '7d' } = req.query;
        // Calculate date range
        let startDate;
        let endDate = new Date();
        if (start_date && end_date) {
            startDate = new Date(start_date);
            endDate = new Date(end_date);
        }
        else {
            // Default periods
            const now = new Date();
            switch (period) {
                case '1d':
                    startDate = new Date(now.setHours(0, 0, 0, 0));
                    break;
                case '7d':
                    startDate = new Date(now.setDate(now.getDate() - 7));
                    break;
                case '30d':
                    startDate = new Date(now.setDate(now.getDate() - 30));
                    break;
                case '90d':
                    startDate = new Date(now.setDate(now.getDate() - 90));
                    break;
                default:
                    startDate = new Date(now.setDate(now.getDate() - 7));
            }
        }
        // Overview Stats
        const overviewQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE event_type = 'pageview') as total_pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(*) FILTER (WHERE is_bounce = TRUE) as total_bounces,
        AVG(time_on_page) FILTER (WHERE time_on_page IS NOT NULL) as avg_time_on_page
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at <= :end_date
    `;
        const overview = await database_1.default.query(overviewQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const overviewData = overview[0] || {};
        const totalPageviews = parseInt(overviewData.total_pageviews) || 0;
        const uniqueVisitors = parseInt(overviewData.unique_visitors) || 0;
        const totalSessions = parseInt(overviewData.total_sessions) || 0;
        const totalBounces = parseInt(overviewData.total_bounces) || 0;
        const avgTimeOnPage = parseFloat(overviewData.avg_time_on_page) || 0;
        const bounceRate = totalSessions > 0 ? (totalBounces / totalSessions) * 100 : 0;
        const avgPagesPerSession = totalSessions > 0 ? totalPageviews / totalSessions : 0;
        // Active Users (last 5 minutes)
        const activeUsersQuery = `
      SELECT COUNT(DISTINCT visitor_id) as active_users
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
    `;
        const activeUsersResult = await database_1.default.query(activeUsersQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        const activeUsers = parseInt(activeUsersResult[0]?.active_users) || 0;
        // Top Pages
        const topPagesQuery = `
      SELECT 
        page_path,
        page_title,
        COUNT(*) as pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM analytics_events
      WHERE event_type = 'pageview'
        AND created_at >= :start_date 
        AND created_at <= :end_date
        AND page_path IS NOT NULL
      GROUP BY page_path, page_title
      ORDER BY pageviews DESC
      LIMIT 10
    `;
        const topPages = await database_1.default.query(topPagesQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Traffic Sources
        const trafficSourcesQuery = `
      SELECT 
        traffic_source as source,
        COUNT(DISTINCT visitor_id) as visitors
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at <= :end_date
        AND traffic_source IS NOT NULL
      GROUP BY traffic_source
      ORDER BY visitors DESC
    `;
        const trafficSources = await database_1.default.query(trafficSourcesQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalTrafficVisitors = trafficSources.reduce((sum, item) => sum + parseInt(item.visitors), 0);
        const trafficSourcesWithPercentage = trafficSources.map((item) => ({
            source: item.source,
            visitors: parseInt(item.visitors),
            percentage: totalTrafficVisitors > 0 ? (parseInt(item.visitors) / totalTrafficVisitors) * 100 : 0,
        }));
        // Devices
        const devicesQuery = `
      SELECT 
        device_type,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at <= :end_date
        AND event_type = 'pageview'
      GROUP BY device_type
      ORDER BY count DESC
    `;
        const devices = await database_1.default.query(devicesQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const totalDevices = devices.reduce((sum, item) => sum + parseInt(item.count), 0);
        const devicesWithPercentage = devices.map((item) => ({
            device_type: item.device_type,
            count: parseInt(item.count),
            percentage: totalDevices > 0 ? (parseInt(item.count) / totalDevices) * 100 : 0,
        }));
        // Browsers
        const browsersQuery = `
      SELECT 
        browser,
        COUNT(*) as count
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at <= :end_date
        AND event_type = 'pageview'
        AND browser IS NOT NULL
      GROUP BY browser
      ORDER BY count DESC
      LIMIT 10
    `;
        const browsers = await database_1.default.query(browsersQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Countries
        const countriesQuery = `
      SELECT 
        country_code,
        country_name,
        COUNT(DISTINCT visitor_id) as visitors
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at <= :end_date
        AND country_code IS NOT NULL
      GROUP BY country_code, country_name
      ORDER BY visitors DESC
      LIMIT 10
    `;
        const countries = await database_1.default.query(countriesQuery, {
            replacements: { start_date: startDate, end_date: endDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Hourly Pageviews (last 24 hours)
        const hourlyQuery = `
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as pageviews
      FROM analytics_events
      WHERE event_type = 'pageview'
        AND created_at >= NOW() - INTERVAL '24 hours'
      GROUP BY EXTRACT(HOUR FROM created_at)
      ORDER BY hour
    `;
        const hourly = await database_1.default.query(hourlyQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Realtime Active Pages
        const realtimeQuery = `
      SELECT 
        page_path,
        COUNT(DISTINCT visitor_id) as users
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
      GROUP BY page_path
      ORDER BY users DESC
      LIMIT 10
    `;
        const realtimePages = await database_1.default.query(realtimeQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Calculate trend (compare with previous period)
        const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const prevStartDate = new Date(startDate.getTime() - (periodDays * 24 * 60 * 60 * 1000));
        const prevEndDate = new Date(startDate);
        const prevOverviewQuery = `
      SELECT 
        COUNT(*) FILTER (WHERE event_type = 'pageview') as total_pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors,
        COUNT(DISTINCT session_id) as total_sessions
      FROM analytics_events
      WHERE created_at >= :start_date AND created_at < :end_date
    `;
        const prevOverview = await database_1.default.query(prevOverviewQuery, {
            replacements: { start_date: prevStartDate, end_date: prevEndDate },
            type: sequelize_1.QueryTypes.SELECT,
        });
        const prevData = prevOverview[0] || {};
        const prevPageviews = parseInt(prevData.total_pageviews) || 0;
        const prevVisitors = parseInt(prevData.unique_visitors) || 0;
        const prevSessions = parseInt(prevData.total_sessions) || 0;
        const pageviewsChange = prevPageviews > 0 ? ((totalPageviews - prevPageviews) / prevPageviews) * 100 : 0;
        const visitorsChange = prevVisitors > 0 ? ((uniqueVisitors - prevVisitors) / prevVisitors) * 100 : 0;
        const sessionsChange = prevSessions > 0 ? ((totalSessions - prevSessions) / prevSessions) * 100 : 0;
        // Build response
        const stats = {
            overview: {
                total_pageviews: totalPageviews,
                unique_visitors: uniqueVisitors,
                total_sessions: totalSessions,
                avg_session_duration: Math.round(avgTimeOnPage),
                avg_pages_per_session: Math.round(avgPagesPerSession * 100) / 100,
                bounce_rate: Math.round(bounceRate * 100) / 100,
                active_users: activeUsers,
            },
            trend: {
                pageviews_change: Math.round(pageviewsChange * 100) / 100,
                visitors_change: Math.round(visitorsChange * 100) / 100,
                sessions_change: Math.round(sessionsChange * 100) / 100,
            },
            top_pages: topPages.map((p) => ({
                page_path: p.page_path,
                page_title: p.page_title || p.page_path,
                pageviews: parseInt(p.pageviews),
                unique_visitors: parseInt(p.unique_visitors),
            })),
            traffic_sources: trafficSourcesWithPercentage,
            devices: devicesWithPercentage,
            browsers: browsers.map((b) => ({
                browser: b.browser,
                count: parseInt(b.count),
            })),
            countries: countries.map((c) => ({
                country_code: c.country_code,
                country_name: c.country_name || c.country_code,
                visitors: parseInt(c.visitors),
            })),
            hourly_pageviews: hourly.map((h) => ({
                hour: parseInt(h.hour),
                pageviews: parseInt(h.pageviews),
            })),
            realtime: {
                active_users: activeUsers,
                active_pages: realtimePages.map((p) => ({
                    page_path: p.page_path,
                    users: parseInt(p.users),
                })),
            },
        };
        res.json({ success: true, data: stats });
    }
    catch (error) {
        console.error('Failed to get analytics stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get analytics stats',
            details: error.message,
        });
    }
};
exports.getAnalyticsStats = getAnalyticsStats;
// Get Realtime Stats (Admin only)
const getRealtimeStats = async (req, res) => {
    try {
        // Active users in last 5 minutes
        const activeUsersQuery = `
      SELECT COUNT(DISTINCT visitor_id) as active_users
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
    `;
        const activeUsersResult = await database_1.default.query(activeUsersQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Active pages
        const activePagesQuery = `
      SELECT 
        page_path,
        page_title,
        COUNT(DISTINCT visitor_id) as users
      FROM analytics_events
      WHERE created_at >= NOW() - INTERVAL '5 minutes'
      GROUP BY page_path, page_title
      ORDER BY users DESC
      LIMIT 10
    `;
        const activePages = await database_1.default.query(activePagesQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Pageviews in last 30 minutes (by minute)
        const pageviewsByMinuteQuery = `
      SELECT 
        DATE_TRUNC('minute', created_at) as minute,
        COUNT(*) as pageviews
      FROM analytics_events
      WHERE event_type = 'pageview'
        AND created_at >= NOW() - INTERVAL '30 minutes'
      GROUP BY DATE_TRUNC('minute', created_at)
      ORDER BY minute DESC
    `;
        const pageviewsByMinute = await database_1.default.query(pageviewsByMinuteQuery, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({
            success: true,
            data: {
                active_users: parseInt(activeUsersResult[0]?.active_users) || 0,
                active_pages: activePages.map((p) => ({
                    page_path: p.page_path,
                    page_title: p.page_title || p.page_path,
                    users: parseInt(p.users),
                })),
                pageviews_by_minute: pageviewsByMinute.map((p) => ({
                    minute: p.minute,
                    pageviews: parseInt(p.pageviews),
                })),
            },
        });
    }
    catch (error) {
        console.error('Failed to get realtime stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get realtime stats',
            details: error.message,
        });
    }
};
exports.getRealtimeStats = getRealtimeStats;
//# sourceMappingURL=analyticsController.js.map