import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpDown, Download, Upload } from "lucide-react";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">RimToken</h1>
          <p className="text-xl text-blue-200">محفظة العملات المشفرة الحديثة</p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Wallet className="h-6 w-6" />
                المحفظة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                فتح المحفظة
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <ArrowUpDown className="h-6 w-6" />
                التبديل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                تبديل العملات
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white flex items-center justify-center gap-2">
                <Download className="h-6 w-6" />
                الإيداع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                إيداع عملات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-blue-200">
            منصة آمنة لإدارة العملات المشفرة عبر شبكات Ethereum و Solana و BSC و Polygon
          </p>
          <div className="mt-4">
            <p className="text-white">📞 37968897 | 📧 INFO@RIMTOKEN.ORG</p>
          </div>
        </div>
      </div>
    </div>
  );
}