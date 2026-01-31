import Fuse, { type FuseOptions } from "fuse.js";

/** Searchable properties. Must be defined in this way to be able to derive union type and satisfy FuseOptions  */
const keys: ["title"] = ["title"];

/** Union type to make sure these particular keys are present in collection that's being passed in for search. */
type Keys = (typeof keys)[number];

type BaseGroup = Record<PropertyKey, unknown>;
type BaseItem = Record<Keys, string | number>;
type Group<G extends BaseGroup, T extends BaseItem> = G & {
  items: T[];
};

const FUSE_OPTIONS: FuseOptions<BaseItem> = {
  shouldSort: true,
  threshold: 0.1,
  keys,
};

/** Filter entity groups by search term using fuse.js */
export const filterEntityGroupsBySearchTerm = <
  G extends BaseGroup,
  T extends BaseItem,
>(
  searchTerm: string,
  groups: Array<Group<G, T>>,
): Array<Group<G, T>> => {
  if (!searchTerm) {
    return groups;
  }

  // Cache Fuse instances per items array to avoid reconstructing Fuse repeatedly
  // when the same items array identity is passed in multiple calls.
  // WeakMap keys are the items arrays themselves so they won't prevent GC.
  const fuseCache: WeakMap<BaseItem[], Fuse<BaseItem>> =
    (filterEntityGroupsBySearchTerm as unknown as { __fuseCache?: WeakMap<BaseItem[], Fuse<BaseItem>> }).__fuseCache ??
    new WeakMap<BaseItem[], Fuse<BaseItem>>();
  // store back on the function object so subsequent calls reuse the cache
  (filterEntityGroupsBySearchTerm as unknown as { __fuseCache?: WeakMap<BaseItem[], Fuse<BaseItem>> }).__fuseCache =
    fuseCache;

  const result: Array<Group<G, T>> = [];
  for (let i = 0, len = groups.length; i < len; i++) {
    const group = groups[i];
    const items = group.items as BaseItem[];

    let fuse = fuseCache.get(items);
    if (!fuse) {
      fuse = new Fuse(items, FUSE_OPTIONS);
      fuseCache.set(items, fuse);
    }

    const searchResults = fuse.search(searchTerm) as unknown as T[];

    if (searchResults.length) {
      // Create a shallow copy of the group with the filtered items to avoid mutating input
      result.push(Object.assign({}, group, { items: searchResults }) as Group<G, T>);
    }
  }

  return result;
};
