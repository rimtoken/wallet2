import { Web3Wallet } from "@/components/web3/web3-wallet";
import rimTokenLogo from "@/assets/logo/rimtoken-logo.png";

interface Web3WalletPageProps {
  userId: number;
}

export default function Web3WalletPage({ userId }: Web3WalletPageProps) {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center">
        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4">
          <img src={rimTokenLogo} alt="RimToken Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">محفظة RimToken (ويب 3)</h1>
          <p className="text-gray-500 mt-2">
            أنشئ وإدارة محافظ ويب 3 الخاصة بك على مختلف شبكات البلوكتشين.
          </p>
        </div>
      </div>
      
      <Web3Wallet />
    </div>
  );
}