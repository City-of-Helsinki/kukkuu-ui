import type { ReactNode } from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateEnum } from '@city-of-helsinki/react-helsinki-headless-cms';
import { PageByTemplateDocument } from '@city-of-helsinki/react-helsinki-headless-cms/apollo';

import { customRender as render } from '../../../common/test/customRender';
import { fakeHero, fakePage } from '../../../utils/cmsMockDataUtils';
import Home from '../Home';
import styles from '../home.module.scss';

const mockIsAuthenticated = vi.fn();
const mockUseProfileContext = vi.fn();

vi.mock('hds-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('hds-react')>();

  return {
    ...actual,
    useOidcClient: () => ({
      isAuthenticated: mockIsAuthenticated,
    }),
  };
});

vi.mock('../../profile/hooks/useProfileContext', () => ({
  useProfileContext: () => mockUseProfileContext(),
}));

vi.mock('../../profile/ProfileProvider', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../../auth/KukkuuHDSLoginProvider', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../../auth/IdleTimerProvider', () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock('../hero/HomeHero', () => ({
  default: ({
    userHasProfile,
    userIsAuthenticated,
    scrollToForm,
    title,
  }: {
    userHasProfile: boolean;
    userIsAuthenticated: boolean;
    scrollToForm: () => void;
    title?: string;
  }) => (
    <div>
      <div data-testid="hero-props">
        {String(userHasProfile)}:{String(userIsAuthenticated)}
      </div>
      {title && <div data-testid="hero-page-title">{title}</div>}
      <button type="button" onClick={scrollToForm}>
        Scroll to form
      </button>
    </div>
  ),
}));

vi.mock('../form/HomePreliminaryForm', () => ({
  default: ({ forwardRef, isAuthenticated }: { forwardRef: React.Ref<HTMLDivElement>; isAuthenticated: boolean }) => (
    <div ref={forwardRef} data-testid="preliminary-form">
      {String(isAuthenticated)}
    </div>
  ),
}));

vi.mock('../moreInfo/HomeMoreInfo', () => ({ default: () => null }));
vi.mock('../instructions/HomeInstructions', () => ({ default: () => null }));
vi.mock('../video/HomeVideo', () => ({ default: () => null }));
vi.mock('../partners/HomePartners', () => ({ default: () => null }));
vi.mock('../contact/HomeContact', () => ({ default: () => null }));

describe('<Home />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated.mockReturnValue(false);
    mockUseProfileContext.mockReturnValue({ profile: null });
  });

  it('renders the preliminary form when the user has no profile', () => {
    mockIsAuthenticated.mockReturnValue(true);

    render(<Home />);

    expect(screen.getByTestId('hero-props')).toHaveTextContent('false:true');
    expect(screen.getByTestId('preliminary-form')).toHaveTextContent('true');
  });

  it('hides the preliminary form and applies profile layout when the user has a profile', () => {
    mockUseProfileContext.mockReturnValue({ profile: { id: 'profile-1' } });

    render(<Home />);

    expect(screen.getByTestId('hero-props')).toHaveTextContent('true:false');
    expect(screen.queryByTestId('preliminary-form')).not.toBeInTheDocument();
    expect(
      document.querySelector(`.${styles.userHasProfileContainer}`)
    ).toBeInTheDocument();
  });

  it('scrolls to the preliminary form when hero requests it', async () => {
    const user = userEvent.setup();
    const scrollToSpy = vi
      .spyOn(globalThis.window, 'scrollTo')
      .mockImplementation(() => undefined);

    render(<Home />);

    const form = screen.getByTestId('preliminary-form');
    Object.defineProperty(form, 'offsetTop', {
      configurable: true,
      value: 321,
    });

    await user.click(screen.getByRole('button', { name: 'Scroll to form' }));

    expect(scrollToSpy).toHaveBeenCalledWith(0, 321);
  });

  it('fetches frontpage from CMS using PageByTemplateDocument and passes title to HomeHero', async () => {
    const cmsFrontPage = fakePage({
      title: 'CMS Etusivu',
      hero: fakeHero({ title: 'CMS Etusivu' }),
    });

    render(<Home />, [
      {
        request: {
          query: PageByTemplateDocument,
          variables: { template: TemplateEnum.FrontPage, language: 'fi' },
        },
        result: {
          data: {
            pageByTemplate: cmsFrontPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('hero-page-title')).toHaveTextContent(
        'CMS Etusivu'
      );
    });
  });

  it('passes resolved hero image to PageWrapper and PageMeta when available from CMS', async () => {
    const cmsFrontPage = fakePage({
      title: 'CMS Etusivu',
      hero: fakeHero({
        title: 'CMS Etusivu',
        background_image_url: 'https://example.com/hero-bg.jpg',
      }),
      featuredImage: null,
      seo: {
        __typename: 'SEO',
        socialImage: null,
      },
    });

    render(<Home />, [
      {
        request: {
          query: PageByTemplateDocument,
          variables: { template: TemplateEnum.FrontPage, language: 'fi' },
        },
        result: {
          data: {
            pageByTemplate: cmsFrontPage,
          },
        },
      },
    ]);

    await waitFor(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute(
        'content',
        'https://example.com/hero-bg.jpg'
      );
    });
  });
});
