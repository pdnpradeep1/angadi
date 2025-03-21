import React, { useState } from 'react';
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiGrid, 
  FiList,
  FiAlertCircle
} from 'react-icons/fi';
import Table from '../ui/Table';
import FilterPanel from '../ui/FilterPanel';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ConfirmDialog } from '../ui/Modal';
import { EmptyState } from '../../utils/loading-error-states';

/**
 * A reusable component for displaying, filtering, and managing lists of entities
 * with added pagination support
 */
const GenericDataList = ({
  title,
  data = [],
  columns,
  filters = {},
  onSearch,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  onDelete,
  onAdd,
  loading = false,
  error = null,
  emptyState,
  actionButtons = [],
  viewMode = 'list',
  onViewModeChange,
  showViewModeToggle = false,
  renderGridView,
  bulkActions = [],
  selectedItems = [],
  onItemSelect,
  onSelectAll,
  filterOpen,
  setFilterOpen,
  searchTerm = '',
  setSearchTerm,
  entityName = 'item',
  pagination = null // New pagination prop
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [bulkActionType, setBulkActionType] = useState(null);

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(itemToDelete);
    }
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const handleBulkAction = (actionType) => {
    if (selectedItems.length === 0) {
      alert(`Please select at least one ${entityName}`);
      return;
    }
    
    if (actionType === 'delete') {
      setBulkActionType('delete');
      setShowDeleteConfirm(true);
    } else {
      // For other bulk actions
      const action = bulkActions.find(action => action.type === actionType);
      if (action && action.handler) {
        action.handler(selectedItems);
      }
    }
  };

  const confirmBulkDelete = () => {
    if (bulkActionType === 'delete' && onDelete) {
      onDelete({ id: 'bulk', items: selectedItems });
    }
    setShowDeleteConfirm(false);
    setBulkActionType(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Prepare empty state component
  const renderEmptyState = () => {
    // If emptyState is a React element, use it directly
    if (React.isValidElement(emptyState)) {
      return emptyState;
    }
    
    // If emptyState is an object with properties, create an EmptyState component with these props
    if (emptyState && typeof emptyState === 'object') {
      return (
        <EmptyState
          title={emptyState.title || `No ${entityName}s found`}
          message={emptyState.message || `There are no ${entityName}s matching your criteria.`}
          actionText={emptyState.actionText}
          onAction={emptyState.onAction}
          icon={emptyState.icon}
        />
      );
    }
    
    // Default empty state
    return (
      <EmptyState
        title={`No ${entityName}s found`}
        message={`There are no ${entityName}s available. Get started by creating a new ${entityName}.`}
        actionText={onAdd ? `Add ${entityName}` : undefined}
        onAction={onAdd}
      />
    );
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <div className="flex space-x-2">
          {/* View mode toggle if enabled */}
          {showViewModeToggle && onViewModeChange && (
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => onViewModeChange('list')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } rounded-l-md border border-gray-300 dark:border-gray-600 flex items-center`}
              >
                <FiList className="mr-1" /> List
              </button>
              <button
                onClick={() => onViewModeChange('grid')}
                className={`px-3 py-2 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } rounded-r-md border border-gray-300 dark:border-gray-600 border-l-0 flex items-center`}
              >
                <FiGrid className="mr-1" /> Grid
              </button>
            </div>
          )}

          {/* Additional action buttons */}
          {actionButtons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "secondary"}
              onClick={button.onClick}
              className={button.className}
            >
              {button.icon && <span className="mr-2">{button.icon}</span>}
              {button.label}
            </Button>
          ))}

          {/* Add button */}
          {onAdd && (
            <Button variant="primary" onClick={onAdd}>
              <FiPlus className="mr-2" /> Add {entityName}
            </Button>
          )}
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedItems.length > 0 && bulkActions.length > 0 && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="text-primary-800 dark:text-primary-300 font-medium">
            {selectedItems.length} {entityName}{selectedItems.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-2">
            {bulkActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "secondary"}
                size="sm"
                onClick={() => handleBulkAction(action.type)}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder={`Search ${entityName}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </form>
        </div>
        <Button
          variant="secondary"
          onClick={() => setFilterOpen(!filterOpen)}
          className="ml-auto"
        >
          <FiFilter className="mr-2" /> Filters
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <FilterPanel
        isOpen={filterOpen}
        filters={filters}
        onFilterChange={onFilterChange}
        onApply={onApplyFilters}
        onClear={onClearFilters}
      />

      {/* Content - Either Table or Grid */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 rounded-full border-t-transparent"></div>
          </div>
        ) : viewMode === 'grid' && renderGridView ? (
          <div className="p-4">
            {data.length > 0 ? 
              renderGridView(data) : 
              renderEmptyState()
            }
          </div>
        ) : (
          <Table
            columns={columns}
            data={data}
            isLoading={loading}
            emptyState={renderEmptyState()}
            onSelectAll={onSelectAll}
            selectedItems={selectedItems}
          />
        )}
      </Card>

      {/* Pagination - render if provided */}
      {pagination && !loading && data.length > 0 && (
        <div className="mt-6">
          {pagination}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
          setBulkActionType(null);
        }}
        onConfirm={bulkActionType ? confirmBulkDelete : confirmDelete}
        title={`Delete ${bulkActionType ? 'Multiple' : 'Single'} ${entityName}`}
        message={
          bulkActionType
            ? `Are you sure you want to delete ${selectedItems.length} ${entityName}${selectedItems.length !== 1 ? 's' : ''}? This action cannot be undone.`
            : `Are you sure you want to delete "${itemToDelete?.name || 'this item'}"? This action cannot be undone.`
        }
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default GenericDataList;