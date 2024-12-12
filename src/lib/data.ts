export async function fetchBusinessData({ cursor = 0, limit = 100 }) {
  try {
    const response = await fetch(`/api/businesses?cursor=${cursor}&limit=${limit}`);
    const data = await response.json();
    return {
      items: data.items,
      nextCursor: data.nextCursor,
      hasMore: data.hasMore,
      totalCount: data.totalCount
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      items: [],
      nextCursor: cursor,
      hasMore: false,
      totalCount: 0
    };
  }
} 