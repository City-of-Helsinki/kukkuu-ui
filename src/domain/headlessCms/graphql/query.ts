import { gql } from '@apollo/client/core';

export const PAGE_QUERY = gql`
  query Page($id: ID!, $idType: PageIdType) {
    page(id: $id, idType: $idType) {
      ...pageFields
      translations {
        ...pageFields
      }
      parent {
        node {
          ... on Page {
            ...pageFields
            translations {
              ...pageFields
            }
          }
        }
      }
      children {
        nodes {
          ... on Page {
            ...pageFields
            translations {
              ...pageFields
            }
          }
        }
      }
    }
  }

  fragment pageFields on Page {
    id
    content
    slug
    title
    uri
    lead
    seo {
      ...seoFields
    }
    language {
      code
      slug
      locale
      name
    }
    featuredImage {
      node {
        mediaItemUrl
        link
        altText
        mimeType
        title
        uri
      }
    }
    sidebar {
      ... on LayoutLinkList {
        anchor
        title
        description
        links {
          target
          title
          url
        }
      }
      ... on LayoutArticles {
        articles {
          id
          title
          uri
          featuredImage {
            node {
              altText
              mediaItemUrl
            }
          }
        }
      }
      ... on LayoutPages {
        pages {
          id
          title
          uri
          featuredImage {
            node {
              altText
              mediaItemUrl
            }
          }
        }
      }
    }
  }

  fragment seoFields on SEO {
    title
    description
    openGraphTitle
    openGraphDescription
    openGraphType
    twitterTitle
    twitterDescription
  }
`;

export const PAGES_QUERY = gql`
  query Pages {
    pages(first: 100) {
      edges {
        node {
          ...pageFields
        }
      }
    }
  }
`;

export const NOTIFICATION_QUERY = gql`
  query Notification($language: String! = "fi") {
    notification(language: $language) {
      content
      title
      level
      startDate
      endDate
      linkText
      linkUrl
    }
  }
`;
