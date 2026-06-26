import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import Home from "./pages/Home";
import Root from "./Root.";
import ProductDetails from "./pages/ProductDetails";

const router= createBrowserRouter([{


   path:"/",
   Component: Root,

   children:[{

    index:true,
    Component: Home
   },
   
   {
     
   path:"product/:id",
   Component:ProductDetails
   
   }]

   

}])
function App() {
 

  return (
    <> 
     <RouterProvider router={router} />;
     
      
    </>
  )
}

export default App
