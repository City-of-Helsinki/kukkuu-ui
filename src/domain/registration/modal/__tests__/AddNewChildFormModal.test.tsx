import { render } from '../../../../common/test/testingLibraryUtils';
import AddNewChildFormModal from '../AddNewChildFormModal';

it('renders snapshot correctly', () => {
  const { container } = render(
    <AddNewChildFormModal addChild={vi.fn()} setIsOpen={vi.fn()} />
  );
  expect(container).toMatchSnapshot();
});
