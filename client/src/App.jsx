import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// import { useAuthContext } from 'hooks/useAuthContext';
// import { useCartContext } from 'hooks/useCartContext';

import ProductProvider from 'context/product/ProductProvider';
import CheckoutProvider from 'context/checkout/CheckoutProvider';

import { Layout } from 'components/layouts';
import { ProtectedRoutes } from 'components/routes';

import {
  HomePage,
  AccountPage,
  AddressesPage,
  LoginPage,
  SignUpPage,
  CollectionPage,
  ProductPage,
  CartPage,
  CheckoutPage,
} from './components/pages';

function App() {
  return (
    <>
      <div className="fonts_license">
        Font made from{' '}
      </div>
      {/* {(!authIsReady || !cartIsReady) && <Loader />}
      {authIsReady && cartIsReady && ( */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collections/:id" element={<CollectionPage />} />
            <Route
              path="products/:id"
              element={
                <ProductProvider>
                  <ProductPage />
                </ProductProvider>
              }
            />
            <Route path="cart" element={<CartPage />} />

            <Route element={<ProtectedRoutes needAuth={true} />}>
              <Route
                path="checkout"
                element={
                  <CheckoutProvider>
                    <CheckoutPage />
                  </CheckoutProvider>
                }
              />
              <Route path="account" element={<AccountPage />} />
              <Route path="account/addresses" element={<AddressesPage />} />
            </Route>

            <Route element={<ProtectedRoutes needAuth={false} />}>
              <Route path="account/login" element={<LoginPage />} />
              <Route path="account/signup" element={<SignUpPage />} />
            </Route>

            {/* <Route element={<ProtectedRoutes needAdmin={true} />}>
              <Route path="admin" element={<AdminPage />} />
              <Route path="admin/products" element={<AdminCollections />} />
              <Route path="admin/products/add" element={<AdminAddProduct />} />
              <Route
                path="admin/products/:productId"
                element={<AdminEditProduct />}
              />
            </Route> */}

            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      {/* )} */}
    </>
  );
}

export default App;
