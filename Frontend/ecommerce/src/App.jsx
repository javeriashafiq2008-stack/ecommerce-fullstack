import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";
import Home from "./pages/Home";
import Root from "./Root..jsx";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/auth/Register";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Billing from "./pages/Billing";
import CreateProduct from "./pages/CreateProduct.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VendorDashboard from "./pages/dashboard/vendorDashboard.jsx";
import EditProduct from "./pages/dashboard/edit.jsx";
import AdminDashboard from "./pages/dashboard/adminDashboard.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";
import ManageProducts from "./pages/admin/ManageProducts.jsx";
import BuyerOrders from "./pages/BuyersOrders.jsx";
import Profile from "./pages/ProfilePage.jsx";


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
    
    
  path: "create",
  element: (
    <ProtectedRoute>
      <CreateProduct />
    </ProtectedRoute>
  )



   },

    {
   path:"buyer/orders",
   element:<ProtectedRoute>
    <BuyerOrders/>
   </ProtectedRoute>
  

   },
   {
   path:"edit/:id",
   element: (<ProtectedRoute>
    <EditProduct/></ProtectedRoute>
   )

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

        path:"vendordashboard",
        element:<ProtectedRoute>
          <VendorDashboard/>
        </ProtectedRoute>
      }
  ,
  {

    path:"admin/dashboard",
     element:<ProtectedRoute>
             <AdminDashboard/>
            </ProtectedRoute>

 
  },
   {
    
    path:"admin/users",
    element:<ProtectedRoute>  
      <ManageUsers/>
    </ProtectedRoute>


   },
   {
    path:"admin/orders",
    element:<ProtectedRoute>  
      <ManageOrders/>
    </ProtectedRoute>


   },

   {
   path:"admin/products",
   element:<ProtectedRoute>
    <ManageProducts/>
   </ProtectedRoute>
  

   },
   {
     
   path:"product/:id",
   Component:ProductDetails
   
   },
    
   {
   
    path:"billing",
    Component:Billing


   },{
       path:"/profile",
   element:<ProtectedRoute>
   <Profile/>
   </ProtectedRoute>

   }
  
  ]

   

}])
function App() {
 

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
