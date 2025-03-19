// Export all variant-related components from a central file
import ProductVariantsManager from './ProductVariantsManager';
import VariantOptionTypes from './VariantOptionTypes';
import VariantAttributeEditor from './VariantAttributeEditor';
import VariantTable from './VariantTable';
import VariantModal from './VariantModal';
import ColorPicker from './ColorPicker';
import SizePicker from './SizePicker';

export {
  ProductVariantsManager,
  VariantOptionTypes,
  VariantAttributeEditor,
  VariantTable,
  VariantModal,
  ColorPicker,
  SizePicker
};

// Default export for easier importing
export default ProductVariantsManager;