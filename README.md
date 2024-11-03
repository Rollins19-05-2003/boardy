This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Run the Project
First, run the development server:
1. npm run dev (frontend)
2. npx convex dev (backend)

## Getting Started
1. npx create-next-app@latest
2. npx shadcn-ui@latest init (Default version and slate as base color)
3. page.tsx is the root file inside app folder
4. Routing in NextJS -- https://nextjs.org/docs/getting-started/project-structure
5. Importance of layout file - to create a static content i.e, navbar or sidebar across our project. 
6. Database and Authentication - 
    - convex for DB (follows steps in convex nextjs quickstart docs) and 
    - clerk for authentication
        STEPS : 
        (i) sign in
        (ii) create a new application
        (iii) select email address
        (iv) copy clerk_public_key and clerk_secret_key in .env.local
        (v) follow docs for clerk nextjs and skip clerkProvider part and copy paster middleware code.
        (vi) Follow convex clerk docs by creating a JWT Template and also replace domain : "link" in auth.config.js file to issuerID provided in JWT Template & make sure applicationID : "..." is same as aud : "..." fields in JWT Template
        (vii) Configure convexProviderWithClerk by creating a provider folder in root of your application.
            ```
            "use client";
            import { ClerkProvider, useAuth } from "@clerk/nextjs";  
            import { ConvexProviderWithClerk } from "convex/react-clerk";
            import{
                AuthLoading,
                Authenticated,
                ConvexReactClient,
            } from "convex/react"
            import {Loading} from "@/components/auth/loading"
            interface ConvexClientProviderProps{
                children : React.ReactNode;
            };

            const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

            const convex = new ConvexReactClient(convexUrl);

            export const ConvexClientProvider = ({
                children,
            }: ConvexClientProviderProps) =>{
                return(
                    <ClerkProvider>
                        <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
                            <Authenticated>
                                {children}
                            </Authenticated>

                            <AuthLoading>
                                <Loading/>
                            </AuthLoading>
                        </ConvexProviderWithClerk>
                    </ClerkProvider>
                );
            };
            ```
            
        (viii) wrap your code everything inside body of layout.tsx with convexClientProvider just created.
7. Create navbar, sidebar and organization sidebar.
8. Enable organization from clerk dashboard and make update in JWT Template.
9. createOrganization, useOrganization, useOrganizationList, organizationSwitcher, OrganizationProfile and userButton are directly imported from @clerk/nextjs
10. For search-input, i have use queryString, usehooks-ts for debouncedValue and useRouter from "next/navigation".
11. Create empty-states for every part.
12. create a board-schema in convex folder then create a board.ts file where we will write all function related to board i.e, create board, delete baord, etc..using mutation function. We have created a useApiMutation hooks for that by using useMutation hook from convex/react.
13. we have use Toaster component for displaying status from shadcn/sooner and wrap our application is a <Toaster/> component in layout.tsx
14. we create boardCard and overlay component and also we have install date-fns package to use formatDistanceToNow method to show the time when card was created as (27mins ago).
15. We implemented card actions for copy link and deleting board similary by creating a function using apiMutation.
16. For implementing rename functionality we have created a differents hooks, modal and a provider. We created a hooks in a different folder i.e., "store", modal in folder named as "modals" -> useRenameModal using zustand and since we are using zustand so it may give a hydration error so we created a provider and wrap that provider i.e, <modalProviders/> in layout.tsx
17. # Now, its time to implement Favourite functionality.
    - make changes in schema.ts and check in convex dashboard.
    - create a mutation function for favouriting and unfavouriting in board.ts
    - write code for it in <Footer/> component of boardcard/index.tsx
    - Implement footer component.
    - make necessary changes in boards.tsx (implementing boardsWithFavoriteRelation) and 
    - make update on remove function in board.ts because we have to remove from userFavorites relation as well.

18. # Implement Search Functionality
    - write the code in boards.ts file
    - pass the searchQuery as parameter in board-list.tsx in useQuery();

-----------------------------------------------------------------------------------------------
## Canvas Layout
1. created a dummy skeleton of how our canvax's gonna look like
2. Connecting our project with liveblocks
    # Installation
    - npm i @liveblocks/react & npm i @liveblocks/client
    - npx create-liveblocks-app@latest --init --framework react

    - create a <Room/> provider and wrap our canvas in page.tsx with the room so that only user who are part of the respective organisation can access the boards in that organization.

    - Now, since we have created a room so we will have a roomID for each canvas/board we open with the roomID same as boardID which we can see in liveblocks dashboard. This sychronization between convexDB and liveblocks will help us in keepong history of canvas, undo, redo and many more functionality.

3. Create a Loading Component because while liveblocks will be authenticating whether the visitor is allowed or not allowed to visit our canvas, it will give a fallback as Loading component.

4. # HOW LIVEBLOCKS WILL AUTHENTICATE USER ?
- First, fetch the board using the boardID for which we have written a function get in board.ts
- 2nd, follow liveblocks docs in authentication and go to access token nextJS and follow the steps.
- 3rd, initialize convex in route.ts so that we can use convex in route-handler and write all the authentication logic in route.ts file.
- In liveblocks.config.ts file, make your endpoint as authEndpoint: "/api/liveblocks-auth"

- change your userMeta in liveblocks.ts
    ``` 
    type UserMeta = {
        id?: string;
        info?: {
            name?: string;
            picture?: string;
        };
    };
    ```
5. Complete Info.tsx
6. Complete Participants.tsx which will show all the users currently viewing ths canvas. We did it with useSelf() and useOthers() hook from liveblocks.
7. Complete toolButton component

-----------------------------------------------------------------------------------------------
## Start Drawing
1. Create a canvas.ts file where canvasState, layerTypes and all our canvas element will be created.
2. {useCanUndo, useCAnRedo, history } from liveblocks.config provides us a out-of-the box method for undo and redo functionality.
3. We will build cursorPresence using a bunch of codes.
    - In canvas.tsx, call the <CursorPresence/> component inside which we created another component known as cursor which will be our main file.
    - We first extract the userInfo from the connectionID which is passed as props and cursorPosition on the screen with the help of liveblocks.config presence object.
    - Then, we render the mousePointer and the name of the user on the canvas
    - In canvas.tsx, we wrap our <CursorPresence/> component in svg ad g tag which has few props such as onPointerMove, onWheel, onMouseLeave, onMouseUp, onMouseDown, etc... so implemet all that.

    - In onPointerMove, we created a utils function pointerEventToCanvasPoint() which converts reactPointer event to canvas coordinates
   ```
     export function pointerEventToCanvasPoint(
        e: React.PointerEvent,
        camera: Camera,
        ) {
            return {
                x: Math.round(e.clientX) - camera.x,
                y: Math.round(e.clientY) - camera.y,
            };
        }  
   ```
4. # Insert Layer :
    - create a insertLayer method in canvas.tsx 
    - 1st. Extract all the curret layers from the canvas using storage from liveblocks which will give the all layerID's and if its length is more than MAX_ALLOWED_LAYER_SIZE then just return. 
    - else, create a new layerObject and create a layerID with the help of nanoid, and push the new layer created in existing layers.
    - to make it visible on our canvas, we created a LayerPreview component as well.
    - Implement lastUsedColor, fill and other functionality as well.
    - Implement selectionBox component and built resize funtionality.
    - selectionTools for changng color, delete and deep-layers (sendToBack and sendToFront).
    - selectionNet.

5. Same for other layers as well i.e., ellipse, text, sticky notes = rectangle + text. For text we used content-editable from react-contenteditable.

6. # Pencil Tool
- update Presence in liveblocks.config and put 
    . pencilDraft parameters as points & pressure.
    . penColor
- create a startDrawing function in canvas.tsx and other subsequent function.

- install npm perfect-freehand for rendering our strokes.
- add code in layer-preview
- create a function in utils known as getSvgPathFromStroke.
- create a draft for real-time showing of path created by pen.

