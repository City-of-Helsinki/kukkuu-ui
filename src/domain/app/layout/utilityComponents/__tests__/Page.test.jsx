import {
  render,
  waitFor,
} from '../../../../../common/test/testingLibraryUtils';
import Page from '../Page';

const title = 'Page component';
const defaultProps = { title };
const getWrapper = (props) => render(<Page {...defaultProps} {...props} />);

describe('<Page />', () => {
  it('should set title', async () => {
    getWrapper();

    await waitFor(() => expect(document.title.length > 0).toEqual(true));
    expect(document.title).toMatchInlineSnapshot(
      `"Page component - Kulttuurin kummilapset"`
    );
  });

  it('should show loading spinner when isLoading is true', () => {
    const { getByLabelText } = getWrapper({ isLoading: true });

    expect(getByLabelText('Lataa')).toBeTruthy();
  });

  it('should show generic error when error is true', () => {
    const { getByText } = getWrapper({ isLoading: false, error: true });

    expect(getByText('Tapahtui virhe')).toBeTruthy();
    expect(getByText('Yritä myöhemmin uudestaan')).toBeTruthy();
  });

  it('should show custom error when error is an object', () => {
    const name = 'Error name';
    const description = 'Error description';
    const { getByText } = getWrapper({
      isLoading: false,
      error: {
        name,
        description,
      },
    });

    expect(getByText(name)).toBeTruthy();
    expect(getByText(description)).toBeTruthy();
  });

  it('should render children when isReady is true', () => {
    const children = 'content';
    const { getByText } = getWrapper({
      isLoading: false,
      isReady: true,
      children,
    });

    expect(getByText(children)).toBeTruthy();
  });
});
