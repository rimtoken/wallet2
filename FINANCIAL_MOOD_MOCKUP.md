# Financial Mood Indicator Mockup

## Main View (Collapsed)
```
┌─────────────────────────────────────────────────┐
│  مؤشر الحالة المالية                       ⓘ    │
│  نظرة سريعة عن صحة محفظتك المالية              │
├─────────────────────────────────────────────────┤
│                                                 │
│                     😊                          │
│                                                 │
│              حالتك المالية جيدة                 │
│                                                 │
│  ╔════════════════════════════════╗             │
│  ║████████████████░░░░░░░░░░░░░░░░║             │
│  ╚════════════════════════════════╝             │
│  حرج                              ممتاز         │
│                                                 │
│          ┌─────────────────────────┐            │
│          │       عرض التفاصيل      │            │
│          └─────────────────────────┘            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Expanded View (With Details)
```
┌─────────────────────────────────────────────────┐
│  مؤشر الحالة المالية                       ⓘ    │
│  نظرة سريعة عن صحة محفظتك المالية              │
├─────────────────────────────────────────────────┤
│                                                 │
│                     😊                          │
│                                                 │
│              حالتك المالية جيدة                 │
│                                                 │
│  ╔════════════════════════════════╗             │
│  ║████████████████░░░░░░░░░░░░░░░░║             │
│  ╚════════════════════════════════╝             │
│  حرج                              ممتاز         │
│                                                 │
│          ┌─────────────────────────┐            │
│          │      إخفاء التفاصيل     │            │
│          └─────────────────────────┘            │
│                                                 │
│  العوامل المؤثرة في حالتك المالية:              │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ↗️ محفظتك متنوعة بشكل جيد               │    │
│  │   التأثير: +15%                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ↗️ التزام منتظم بالميزانية              │    │
│  │   التأثير: +10%                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ↘️ انخفاض في قيمة الأصول هذا الأسبوع    │    │
│  │   التأثير: -12%                         │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │ ↘️ معدل الإنفاق مرتفع نسبيًا            │    │
│  │   التأثير: -8%                          │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  تم التحديث: ٢٠٢٥/٠٥/١٥ ١:٢٥ م    ⟳            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Emoji States

1. **😁 Excellent** - Score 80-100
   - Very diversified portfolio
   - High profit margins
   - Strong positive trends

2. **😊 Good** - Score 60-79
   - Well-balanced portfolio
   - Positive profit
   - Stable performance

3. **😐 Neutral** - Score 40-59
   - Moderate diversification
   - Minimal profits
   - Some volatility

4. **😟 Concerning** - Score 20-39
   - Poor diversification
   - Recent losses
   - Negative trends

5. **😰 Critical** - Score 0-19
   - Extremely concentrated portfolio
   - Significant losses
   - High volatility

## Progress Bar Colors

- Excellent: Green (#10B981)
- Good: Emerald (#34D399)  
- Neutral: Yellow (#F59E0B)
- Concerning: Orange (#F97316)
- Critical: Red (#EF4444)

## Component Integration in Dashboard

The Financial Mood Indicator component is integrated into the dashboard grid system with the following characteristics:

- Default size: Medium (spans 1/2 width on desktop)
- Default position: Third position in dashboard
- Responsive: Adjusts to full width on mobile devices
- Interactive: Supports drag and drop repositioning