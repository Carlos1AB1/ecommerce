import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import MainLayout from "@/layout/MainLayout";

// Pages
import Home from "@/pages/Home";
import GameDetails from "@/pages/GameDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import UserProfile from "@/pages/UserProfile";
import CategoryPage from "@/pages/CategoryPage";
import SearchPage from "@/pages/SearchPage";
import OrderHistory from "@/pages/OrderHistory";
import NotFound from "@/pages/not-found";
import Support from "@/pages/Support";
import FAQ from "@/pages/FAQ";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Switch>
            {/* Pages with main layout */}
            <Route path="/">
              <MainLayout>
                <Home />
              </MainLayout>
            </Route>
            
            <Route path="/game/:id">
              {(params) => (
                <MainLayout>
                  <GameDetails />
                </MainLayout>
              )}
            </Route>
            
            <Route path="/category/:id">
              {(params) => (
                <MainLayout>
                  <CategoryPage />
                </MainLayout>
              )}
            </Route>
            
            <Route path="/search">
              <MainLayout>
                <SearchPage />
              </MainLayout>
            </Route>
            
            <Route path="/cart">
              <MainLayout>
                <Cart />
              </MainLayout>
            </Route>
            
            <Route path="/checkout">
              <MainLayout>
                <Checkout />
              </MainLayout>
            </Route>
            
            <Route path="/profile">
              <MainLayout>
                <UserProfile />
              </MainLayout>
            </Route>
            
            <Route path="/orders/:id*">
              {(params) => (
                <MainLayout>
                  <OrderHistory />
                </MainLayout>
              )}
            </Route>
            
            <Route path="/orders">
              <MainLayout>
                <OrderHistory />
              </MainLayout>
            </Route>
            
            <Route path="/support">
              <MainLayout>
                <Support />
              </MainLayout>
            </Route>
            
            <Route path="/support/faq">
              <MainLayout>
                <FAQ />
              </MainLayout>
            </Route>
            
            <Route path="/privacy">
              <MainLayout>
                <Privacy />
              </MainLayout>
            </Route>
            
            <Route path="/terms">
              <MainLayout>
                <Terms />
              </MainLayout>
            </Route>
            
            {/* 404 Page */}
            <Route>
              <MainLayout>
                <NotFound />
              </MainLayout>
            </Route>
          </Switch>
          
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
