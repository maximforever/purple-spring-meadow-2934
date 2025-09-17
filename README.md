# Harmonic Fullstack Jam

Thank you for the opportunity to work on this project. I felt that it was a realistic reflection of the kind of day-to-day full-stack work I excel at, and I enjoyed figuring out the architecture and data wrangling challenges!

## AI
I wrote the majority of the code. I heavily used Cursor autocomplete, directed the Agent on some high-level work (particularly on checking my Python code), and used OpenAI Codex to quickly make sense of the codebase. Of course, I'm happy to explain every line of code I submitted!

## Demo

[**Youtube Video Demo**](https://www.youtube.com/watch?v=TAzyAlV5rpc) showing the demo and success/error states (this video is unlisted).


## Completed Work

Here's what I was able to complete:
* A multi-step form allows users to add some/all items from one list to another
* I broke up the app into sensible components (ListNav, ListControls)
* I created two BE endpoints to add items to a list (with deduping and some basic validation/error conditions)
* I pulled in `twMerge` and `cslx` to work with Tailwind and added a prettier config; I also switched from a hardcoded base url to using the built-in Vite ENV.
* I pulled out types from App.tsx into `types.ts`
* I define and return error states in `collections.py` - these are visible in Dev Tools, but not the UI (yet)
* The app is not blocked while items are moving, and only one move operation is allowed - the UI doesn't allow more than 1 move operation, and I added a lock to the collection on the back end.

You can see my work/thinking in TODO.md. You can [**review all the code I added, like a PR diff here**](https://github.com/maximforever/purple-spring-meadow-2934/compare/f7c7b66...main#diff-b335630551682c19a781afebcf4d07bf978fb1f8ac04c6bf87428ed5106870f5): 

## Next steps
* Move collections logic to a React Context and implement FE caching instead of prop drilling. This will help decouple the components, and make it much easier to show 'moving' and 'completed' states, along with errors.
* add unit and end-to-end tests
* add a loading state / spinner, completed state, error state (currently it just displays 'moving')
* add a [Toast](https://sonner.emilkowal.ski/) component to show these completed/error states
* Add a websockets connection for lengthy async operations
* Add a time-out guard


## Approach and Tradeoffs
This challenge seemed straightforward at first glance, but involved a lot of tradeoffs, both in how my technical decisions impact the UX, and in what I could focus on to demonstrate my skills. Here are the most important decisions I made:

**Optimistic loading (better UX) at the cost of building out FE caching**
My first hunch was to optimistically show the moved items in the new list. I am assuming that move operations will succeed most of the time, and the cost of failure is low: since we're not deleting the items from the original list, the worst case is that the user will be frustrated when some of their items disappear from the new list on reload. However, since every table page fetches its own data, which might be sorted (and later filtered), adding the new items to a list is not trivial: it would involve implementing a FE data store (context, Redux, Zustand/Jotai) and writing normalization/de-dupe/stale data logic. This would be a great next step, but I decided to leave it as a next step. To handle this gracefully, when items are moving, we show a moving indicator and keep the user on the current list - and the "move to" list will update as soon as they change pages.

The downside to this is clunkier UX. The upside is that FE data state matches the server, we can move more iteratively

**UI Polish vs full-stack functionality**
While FE polish is normally my jam - and I'd love to improve this, this takehome spanned the full stack: routing, DB, FE data architecture, and component architecture. I didn't invest time into design/UI improvements, or implement clever UI (modals, toast notifications for async ops). Instead, I focused on making sure the core functionality worked and that I laid the groundwork for a maintainable, scalable FE. For example, I took the time to pull out a types file and broke up the app into components, added helpful FE tools (`twMerge`, `clsx`, a prettier config), relied on Vite env variables,  and investigated using a Context + Hooks for the data. We can polish the UI on the next ticket, but these decisions will hopefully positively impact all future FE work.

I realize I'm inteviewing for a FE-heavy role, and would be happy to apply some FE polish as a next step!

**MVP, brute-force, and technical debt**
In general, I tried to get to a reasonable working solution as my first priority. This solution could use some refactoring. For example, the top-level `App.tsx` acts as a wrapper for the table/nav/list actions component. There's bad prop drilling throughout the components.

## Challenges
* The biggest challenge for me on this project was balancing good UX with lengthy async operations. I was able to figure this out partially, but there's more work to do! (Ex: I'm still missing a `completed` state, and the data-fetching logic is not ideal).
* The second biggest challenge was architecture: the different table components are all tightly coupled and use the same data
* While I'm functional in Python, this was my first experience with a Python backend, so I relied on my Rails & Node experience + AI to write good routing & DB logic

## Issues, risks, what's broken

* The components are tightly coupled; selecting a row in the MUI table affects labels in `ListControls`. Using React context will help a lot with this. Currently `App.tsx` is still managing all the data.
* I don't show errors or a Complete state (though it's visible in Dev Tools)
* There's no optimistic data rendering
* Although there's a helpful `useApi` hook, I wrote my own logic for loading/error states in `App.tsx` because the useEffect in the hook runs immediately
* The UI is pretty basic, and the colors are not great (ex: color contrast on hover). Anything actionable is just orange.
* Moving the 10K item list to another list still causes the page to hang. This is happening because of the throttling, and I don't guard against time outs. Implementing the next steps I outlined (async/websocket notifications) should help!


## Assumptions
The main assumption I made is that "Add companies from one list to the other" doesn't mean "move" - I assumed we don't need to remove items from the current collection.


