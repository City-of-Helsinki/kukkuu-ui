import { render } from '../../../../common/test/testingLibraryUtils';
import AddNewChildFormModal from '../AddNewChildFormModal';

it('renders snapshot correctly', () => {
  const { container } = render(
    <AddNewChildFormModal addChild={jest.fn()} setIsOpen={jest.fn()} />
  );
  expect(container).toMatchSnapshot();
});
