'use client';

import { useState } from 'react';
import Checkbox from '@/components/ui/Checkbox/Checkbox';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
  type?: 'checkbox' | 'radio' | 'range';
}

interface ProductFiltersProps {
  filters: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
}

export default function ProductFilters({
  filters,
  selectedFilters,
  onFilterChange,
  onClearAll,
}: ProductFiltersProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filters.map((f) => f.id)
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleCheckboxChange = (groupId: string, optionId: string, checked: boolean) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = checked
      ? [...currentValues, optionId]
      : currentValues.filter((v) => v !== optionId);
    onFilterChange(groupId, newValues);
  };

  const totalSelectedCount = Object.values(selectedFilters).reduce(
    (acc, vals) => acc + vals.length,
    0
  );

  return (
    <div className="sticky top-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {totalSelectedCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-brand-purple-600 hover:text-brand-purple-700"
          >
            Clear all ({totalSelectedCount})
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {filters.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          const selectedCount = selectedFilters[group.id]?.length || 0;

          return (
            <div key={group.id} className="border-b border-gray-200 pb-4">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between py-2 text-left"
              >
                <span className="font-medium text-gray-900">
                  {group.title}
                  {selectedCount > 0 && (
                    <span className="ml-2 text-sm text-brand-purple-600">
                      ({selectedCount})
                    </span>
                  )}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Group Options */}
              {isExpanded && (
                <div className="mt-2 space-y-2">
                  {group.options.map((option) => {
                    const isChecked = selectedFilters[group.id]?.includes(option.id) || false;

                    return (
                      <div key={option.id} className="flex items-center">
                        <Checkbox
                          id={`${group.id}-${option.id}`}
                          checked={isChecked}
                          onChange={(e) =>
                            handleCheckboxChange(group.id, option.id, e.target.checked)
                          }
                          label={
                            <span className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">{option.label}</span>
                              {option.count !== undefined && (
                                <span className="ml-2 text-gray-400">({option.count})</span>
                              )}
                            </span>
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
