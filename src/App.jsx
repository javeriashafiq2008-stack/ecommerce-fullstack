import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import Home from "./pages/Home";
import Root from "./Root.";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/auth/Register";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";


const router= createBrowserRouter([{


   path:"/",
   Component: Root,

   children:[{

    index:true,
    Component: Home
   },
   {
    path:"products",
    Component:Products

   },

   {
    path:"about",
    Component:About

   },


   {
    path:"contact",
    Component:Contact

   },

   {
        path: "register",
        Component: Register,
      },
       {
        path: "login",
        Component: Login,
      },

      

   
   {
     
   path:"product/:id",
   Component:ProductDetails
   
   }]

   

}])
function App() {
 

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
