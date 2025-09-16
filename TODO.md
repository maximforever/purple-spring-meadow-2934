## TODO

[X] Examine data structure - how is the company/collection relationship defined?
[ ] Figure out FE flow and architecture
  [ ] do we want to be able to add ALL the companies / only one page at a time?
  [X] Do we need a wrapper component for the table
  [ ] FE cache/context for companies?
[ ] Set up basic UI components: button, dropdown, event handlers
[ ] Move a small set of companies on the FE
[ ] Think deeply about how to handle delay; brainstorm ideas, then check with AI on more approaches
  "UX should reflect In Progress and Completed states when a lengthy action is being performed without blocking the UI"
  [ ] Figure out how to model In Progress and Completed (locked/unlocked) states on the BE
  [ ] Consider expected UX, optimistic add/remove, websockets, toast notification for done
[ ] Wire up backend - add/remove companies to to list, lock/unlock collections
[ ] UI/UX polish - placement, spacing
[ ] Error notifications - something like Toast? For example, if a collection is locked
[ ] Consider Undo
[ ] Consider Remove



## Approach and Tradeoffs

Cache & optimistic update: the actual back-end update takes a long time, but we can update the cache right away. Tradeoff - seamless UX, but not reflective of actual data state, could be confusing if they refresh while not all the items are moved. Could lock list edits while moving companies.

Backend concern - duplication, if we move existing items.

FE improvements:
installed clsx, twmerge
base url is no longer hardcoded to 8000; depends on VITE env

## Assumptions

Users aren't constantly refreshing the page - 

"Add companies from one list to the other" doesn't mean "move" - assuming we don't need to remove items from the current collection.


## Next steps
