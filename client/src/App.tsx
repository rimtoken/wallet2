import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import SimpleHome from "@/pages/simple-home";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleHome />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;