import { MainLayout } from "@/components/layout/main-layout";
import { motion } from "framer-motion";
import { Twitter, Linkedin, Github, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export default function TeamPage() {
  // بيانات أعضاء الفريق
  const teamMembers: TeamMember[] = [
    {
      name: "عنبرزان",
      role: "المؤسس والرئيس التنفيذي",
      image: "/assets/anbarzan.jpg",
      bio: "خبير في تكنولوجيا البلوكتشين وعالم العملات المشفرة منذ أكثر من 7 سنوات. قام بتأسيس RimToken بهدف تقديم حلول مالية لامركزية آمنة وسهلة الاستخدام.",
      social: {
        twitter: "https://twitter.com/anbarzan",
        linkedin: "https://linkedin.com/in/anbarzan",
        github: "https://github.com/anbarzan"
      }
    },
    {
      name: "حسن",
      role: "المدير التقني",
      image: "/assets/hacen.jpg",
      bio: "مهندس برمجيات متخصص في تطوير تطبيقات البلوكتشين وحلول المحافظ الرقمية. يقود فريق التطوير التقني في RimToken ويشرف على تطوير البنية التحتية للمنصة.",
      social: {
        twitter: "https://twitter.com/hacen_tech",
        linkedin: "https://linkedin.com/in/hacen",
        github: "https://github.com/hacen"
      }
    },
    {
      name: "حميدو",
      role: "مدير المنتج",
      image: "/assets/hamido.jpg",
      bio: "خبرة أكثر من 5 سنوات في إدارة منتجات التكنولوجيا المالية والبلوكتشين. مسؤول عن تطوير استراتيجية المنتج والميزات الجديدة لمنصة RimToken.",
      social: {
        twitter: "https://twitter.com/hamido_product",
        linkedin: "https://linkedin.com/in/hamido"
      }
    },
    {
      name: "حتان",
      role: "مدير التسويق",
      image: "/assets/hatan.jpg",
      bio: "استراتيجي تسويقي متخصص في مجال العملات المشفرة، مع خبرة في بناء وتنفيذ حملات تسويقية ناجحة. يقود جهود التسويق والعلاقات العامة في RimToken.",
      social: {
        twitter: "https://twitter.com/hatan_marketing",
        linkedin: "https://linkedin.com/in/hatan",
        website: "https://hatan.com"
      }
    },
    {
      name: "جوين",
      role: "مدير العمليات",
      image: "/assets/joen.jpg",
      bio: "يمتلك خبرة واسعة في إدارة العمليات والاستراتيجية لشركات التكنولوجيا المالية. مسؤول عن ضمان كفاءة العمليات اليومية وتحسين الأداء التشغيلي لـ RimToken.",
      social: {
        twitter: "https://twitter.com/joen_ops",
        linkedin: "https://linkedin.com/in/joen"
      }
    },
    {
      name: "عثمان كمرة",
      role: "مدير تطوير الأعمال",
      image: "/assets/othmankamra.jpg",
      bio: "متخصص في بناء الشراكات الاستراتيجية والنمو في قطاع البلوكتشين والتكنولوجيا المالية. يعمل على توسيع نطاق وصول RimToken وبناء علاقات مع المستثمرين والشركاء.",
      social: {
        twitter: "https://twitter.com/othman_kamra",
        linkedin: "https://linkedin.com/in/othmankamra"
      }
    }
  ];

  return (
    <MainLayout>
      {/* قسم الترحيب */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-amber-800 mb-6">فريق RimToken</h1>
            <p className="text-lg text-gray-700 mb-8">
              نحن فريق من الخبراء والمتحمسين لتكنولوجيا البلوكتشين والعملات المشفرة، نعمل معًا لبناء منصة آمنة وسهلة الاستخدام لإدارة الأصول الرقمية.
            </p>
          </div>
        </div>
      </section>

      {/* قسم أعضاء الفريق */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={`صورة ${member.name}`} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6">{member.bio}</p>
                  
                  <div className="flex items-center gap-3">
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                        <Twitter size={20} />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                        <Linkedin size={20} />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                        <Github size={20} />
                      </a>
                    )}
                    {member.social.website && (
                      <a href={member.social.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-600 transition-colors">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم الانضمام للفريق */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">انضم إلى فريقنا</h2>
            <p className="text-lg mb-8">
              هل أنت شغوف بالتكنولوجيا المالية والبلوكتشين؟ نحن دائمًا نبحث عن مواهب جديدة للانضمام إلى فريقنا ومساعدتنا في بناء مستقبل المالية اللامركزية.
            </p>
            <Button variant="outline" className="bg-white text-amber-600 hover:bg-gray-100">
              استكشف الوظائف المتاحة
            </Button>
          </div>
        </div>
      </section>

      {/* قسم القيم */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">قيمنا</h2>
            <div className="space-y-6">
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">الابتكار</h3>
                <p className="text-gray-700">
                  نحن ملتزمون بدفع حدود التكنولوجيا وتطوير حلول مبتكرة تجعل التعامل مع العملات المشفرة أكثر سهولة وأمانًا للجميع.
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">الأمان</h3>
                <p className="text-gray-700">
                  نضع أمان أموال المستخدمين على رأس أولوياتنا. نستخدم أحدث تقنيات التشفير وأفضل ممارسات الأمان لحماية أصول المستخدمين.
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">الشفافية</h3>
                <p className="text-gray-700">
                  نؤمن بأهمية الشفافية في كل ما نقوم به. نسعى لتقديم معلومات واضحة وصادقة حول خدماتنا ورسومنا وكيفية عمل منصتنا.
                </p>
              </div>
              <div className="bg-amber-50 rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">تمكين المستخدم</h3>
                <p className="text-gray-700">
                  هدفنا هو تمكين المستخدمين من التحكم الكامل في أصولهم الرقمية وتزويدهم بالأدوات والمعرفة اللازمة لاتخاذ قرارات مالية مستنيرة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}