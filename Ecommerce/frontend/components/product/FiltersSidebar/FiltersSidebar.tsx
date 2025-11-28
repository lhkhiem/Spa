'use client';

import { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox/Checkbox';
import Button from '@/components/ui/Button/Button';

interface Filter {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  name: string;
  options: Filter[];
}

interface FiltersSidebarProps {
  filters: FilterGroup[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

export default function FiltersSidebar({ filters, onFilterChange }: FiltersSidebarProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(filters.map(f => f.name)));

  const handleFilterToggle = (groupName: string, filterId: string) => {
    setSelectedFilters((prev) => {
      const groupFilters = prev[groupName] || [];
      const newGroupFilters = groupFilters.includes(filterId)
        ? groupFilters.filter((id) => id !== filterId)
        : [...groupFilters, filterId];

      const newFilters = {
        ...prev,
        [groupName]: newGroupFilters,
      };

      // Clean up empty arrays
      if (newGroupFilters.length === 0) {
        delete newFilters[groupName];
      }

      onFilterChange?.(newFilters);
      return newFilters;
    });
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {filters.map((group) => (
          <div key={group.name} className="border-b border-gray-200 pb-4">
            {/* Group Header */}
            <button
              className="mb-3 flex w-full items-center justify-between text-left font-medium text-gray-900"
              onClick={() => toggleGroup(group.name)}
            >
              <span>{group.name}</span>
              <span className="text-xl">
                {expandedGroups.has(group.name) ? '−' : '+'}
              </span>
            </button>

            {/* Group Options */}
            {expandedGroups.has(group.name) && (
              <div className="space-y-2">
                {group.options.map((option) => (
                  <Checkbox
                    key={option.id}
                    label={
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-sm text-gray-500">({option.count})</span>
                        )}
                      </div>
                    }
                    checked={selectedFilters[group.name]?.includes(option.id) || false}
                    onChange={() => handleFilterToggle(group.name, option.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="mt-4 text-sm text-gray-600">
          {Object.values(selectedFilters).flat().length} filter(s) applied
        </div>
      )}
    </div>
  );
}
