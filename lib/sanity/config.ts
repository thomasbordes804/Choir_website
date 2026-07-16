export const sanityConfig = {
  projectId:
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset:
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    process.env.REACT_APP_SANITY_DATASET ||
    "production",
  token:
    process.env.SANITY_API_TOKEN ||
    process.env.NEXT_PUBLIC_SANITY_API_TOKEN ||
    process.env.REACT_APP_SANITY_API_TOKEN ||
    undefined,
};