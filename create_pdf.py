#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import markdown2

def create_rimtoken_whitepaper_pdf():
    # Create PDF document
    doc = SimpleDocTemplate("RimToken_WhitePaper.pdf", pagesize=A4,
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1a1a1a')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.HexColor('#2c3e50')
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=14,
        spaceAfter=10,
        spaceBefore=15,
        textColor=colors.HexColor('#34495e')
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6,
        alignment=TA_JUSTIFY,
        leftIndent=0,
        rightIndent=0
    )
    
    # Build PDF content
    story = []
    
    # Title page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("RimToken (RIM)", title_style))
    story.append(Paragraph("Official White Paper", heading_style))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("The Future of Cryptocurrency and Smart Trading", subheading_style))
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("Version 1.0 - May 2025", body_style))
    story.append(Paragraph("© 2025 RimToken. All rights reserved.", body_style))
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Paragraph("Table of Contents", heading_style))
    story.append(Spacer(1, 0.2*inch))
    
    toc_data = [
        ["1. Executive Summary", "3"],
        ["2. Introduction", "4"],
        ["3. Problem and Solution", "5"],
        ["4. RimToken Technology", "7"],
        ["5. Digital Economy", "9"],
        ["6. Artificial Intelligence and Smart Networks", "11"],
        ["7. Roadmap", "13"],
        ["8. Team", "15"],
        ["9. Conclusion", "17"]
    ]
    
    toc_table = Table(toc_data, colWidths=[4*inch, 1*inch])
    toc_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(toc_table)
    story.append(PageBreak())
    
    # Executive Summary
    story.append(Paragraph("1. Executive Summary", heading_style))
    story.append(Paragraph("RimToken (RIM) is an innovative cryptocurrency designed to revolutionize the decentralized finance world by integrating artificial intelligence technologies with blockchain to create an advanced and secure ecosystem for digital financial transactions.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Vision", subheading_style))
    story.append(Paragraph("To become the world's leading platform in smart trading and cryptocurrency transactions, providing advanced and innovative financial solutions to users worldwide.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Mission", subheading_style))
    story.append(Paragraph("Develop a smart trading platform that uses cutting-edge artificial intelligence technologies to analyze markets and provide a secure, user-friendly trading experience.", body_style))
    story.append(PageBreak())
    
    # Introduction
    story.append(Paragraph("2. Introduction", heading_style))
    story.append(Paragraph("In the era of rapid digital transformation, traditional financial markets face significant challenges in meeting the needs of contemporary investors. RimToken emerges as an innovative solution that combines:", body_style))
    story.append(Spacer(1, 0.1*inch))
    
    intro_features = [
        "• <b>Security:</b> Highest standards of protection and cybersecurity",
        "• <b>Speed:</b> Instant transactions at low cost",
        "• <b>Intelligence:</b> Using AI for market analysis and decision-making",
        "• <b>Transparency:</b> All transactions recorded on blockchain"
    ]
    
    for feature in intro_features:
        story.append(Paragraph(feature, body_style))
    story.append(PageBreak())
    
    # Problem and Solution
    story.append(Paragraph("3. Problem and Solution", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Current Market Problems", subheading_style))
    problems = [
        "1. <b>Technical Complexity:</b> Difficulty understanding and using traditional platforms",
        "2. <b>High Fees:</b> Expensive transaction and transfer costs",
        "3. <b>Slow Transactions:</b> Long waiting times for transaction confirmation",
        "4. <b>Lack of Smart Analysis:</b> Absence of advanced analytical tools",
        "5. <b>Security Risks:</b> Security vulnerabilities in traditional platforms"
    ]
    
    for problem in problems:
        story.append(Paragraph(problem, body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("RimToken's Solution", subheading_style))
    solutions = [
        "• <b>Intuitive User Interface:</b> Simple design with full multilingual support",
        "• <b>Low Fees:</b> Transaction fees 90% lower than traditional platforms",
        "• <b>Instant Transactions:</b> Transaction confirmation in seconds",
        "• <b>Advanced AI:</b> Real-time market analysis and smart recommendations"
    ]
    
    for solution in solutions:
        story.append(Paragraph(solution, body_style))
    story.append(PageBreak())
    
    # Technology
    story.append(Paragraph("4. RimToken Technology", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Technical Infrastructure", subheading_style))
    story.append(Paragraph("<b>Hybrid Blockchain:</b> Combining Layer 1 secure main network for large transactions with Layer 2 fast network for daily transactions. Multi-compatibility support for Ethereum, BSC, Polygon, and Solana.", body_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("<b>Proof of Intelligence (PoI):</b> Innovative consensus mechanism combining energy efficiency, high security, processing speed, and fair participation.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Technical Specifications", subheading_style))
    tech_data = [
        ["Feature", "Value"],
        ["Token Name", "RimToken"],
        ["Symbol", "RIM"],
        ["Total Supply", "1,000,000,000 RIM"],
        ["Circulating Supply", "350,000,000 RIM"],
        ["Token Type", "ERC-20 / BEP-20"],
        ["Transaction Speed", "5-10 seconds"],
        ["Transaction Fee", "0.001 RIM"]
    ]
    
    tech_table = Table(tech_data, colWidths=[2.5*inch, 2.5*inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f8f9fa')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#dee2e6'))
    ]))
    story.append(tech_table)
    story.append(PageBreak())
    
    # Digital Economy
    story.append(Paragraph("5. Digital Economy", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Token Distribution", subheading_style))
    distribution = [
        "• <b>35% - Public Sale:</b> 350,000,000 RIM",
        "• <b>25% - Rewards & Incentives:</b> 250,000,000 RIM",
        "• <b>20% - Development & Operations:</b> 200,000,000 RIM",
        "• <b>10% - Team & Advisors:</b> 100,000,000 RIM",
        "• <b>5% - Strategic Partnerships:</b> 50,000,000 RIM",
        "• <b>5% - Reserve:</b> 50,000,000 RIM"
    ]
    
    for dist in distribution:
        story.append(Paragraph(dist, body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Value Mechanisms", subheading_style))
    story.append(Paragraph("<b>Auto-Burn:</b> Burn 2% of transaction fees monthly to gradually reduce supply and increase value through a transparent, community-monitored mechanism.", body_style))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>Reward System:</b> Staking rewards of 12-18% annual return, trading fee discounts for active traders, and referral program rewards.", body_style))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>Decentralized Governance:</b> Voting rights for token holders, proposal submission capabilities, and participation in important platform decisions.", body_style))
    story.append(PageBreak())
    
    # AI and Smart Networks
    story.append(Paragraph("6. Artificial Intelligence and Smart Networks", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Smart Analysis Engine", subheading_style))
    ai_features = [
        "<b>Advanced Market Analysis:</b> Processing billions of data points daily with sentiment analysis and predictive models for high-accuracy price forecasting.",
        "<b>Smart Automated Trading:</b> Trading bots for automatic execution, risk management for capital protection, and continuous strategy optimization.",
        "<b>Smart Personal Assistant:</b> Personalized trading recommendations, instant opportunity notifications, and interactive educational lessons."
    ]
    
    for feature in ai_features:
        story.append(Paragraph("• " + feature, body_style))
        story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("AI Technologies Used", subheading_style))
    ai_tech = [
        "<b>Deep Learning:</b> Advanced neural networks for pattern analysis and continuous model improvement.",
        "<b>Natural Language Processing:</b> News analysis, sentiment understanding, and multi-language support.",
        "<b>Genetic Algorithms:</b> Trading strategy optimization and adaptation to market conditions."
    ]
    
    for tech in ai_tech:
        story.append(Paragraph("• " + tech, body_style))
        story.append(Spacer(1, 0.1*inch))
    story.append(PageBreak())
    
    # Roadmap
    story.append(Paragraph("7. Roadmap", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    roadmap_phases = [
        ("<b>Phase 1 (Q1-Q2 2025): Foundation</b>", [
            "✓ Currency and basic technology development",
            "✓ Official website launch",
            "✓ Core team formation",
            "• Initial network testing",
            "• Initial community building"
        ]),
        ("<b>Phase 2 (Q3-Q4 2025): Launch</b>", [
            "• Official platform launch",
            "• Listing on major exchanges",
            "• Staking services activation",
            "• Mobile app launch",
            "• First strategic partnerships"
        ]),
        ("<b>Phase 3 (Q1-Q2 2026): Expansion</b>", [
            "• Add more supported currencies",
            "• Develop advanced DeFi services",
            "• Hardware wallet launch",
            "• Geographic expansion",
            "• Regulatory licenses in major markets"
        ]),
        ("<b>Phase 4 (Q3-Q4 2026): Innovation</b>", [
            "• NFT Marketplace launch",
            "• Lending and borrowing services",
            "• Blockchain-based game development",
            "• Social trading platform",
            "• Metaverse integration"
        ]),
        ("<b>Phase 5 (2027+): Global Leadership</b>", [
            "• Become one of top 10 global platforms",
            "• Full digital bank launch",
            "• Global payment services",
            "• Corporate and institutional solutions",
            "• Web3 technology leadership"
        ])
    ]
    
    for phase_title, items in roadmap_phases:
        story.append(Paragraph(phase_title, subheading_style))
        for item in items:
            story.append(Paragraph(item, body_style))
        story.append(Spacer(1, 0.1*inch))
    story.append(PageBreak())
    
    # Team
    story.append(Paragraph("8. Team", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("Executive Leadership", subheading_style))
    
    team_members = [
        ("Ahmed Mohammed - Founder & CEO", "8 years in blockchain development, Master's in Computer Science, developed 3 successful trading platforms."),
        ("Sara Ahmed - Marketing & Relations Director", "6 years in tech product marketing, Master's in Business Administration, led $50M+ marketing campaigns."),
        ("Mohammed Ali - Cybersecurity Expert", "10 years in information security, CISSP/CEH/OSCP certified, protected $1B+ in digital assets."),
        ("Fatima Khalid - UI/UX Developer", "5 years in UX/UI development, Bachelor's in Digital Design, exceptional user experience specialist."),
        ("Khalid Ahmed - Product Manager", "7 years in technical product management, Master's in Technology Management, launched 15+ successful products."),
        ("Nour Aldin - Backend Systems Developer", "6 years in systems development, cloud infrastructure specialist, Kubernetes/Docker/Microservices expert."),
        ("Layla Mohammed - Data Analyst", "4 years in financial data analysis, Master's in Applied Statistics, market analysis and AI specialist."),
        ("Omar Al-Aswad - Operations Manager", "8 years in operations management, Master's in Business Administration, led 100+ employee teams.")
    ]
    
    for name, description in team_members:
        story.append(Paragraph("<b>" + name + "</b>", body_style))
        story.append(Paragraph(description, body_style))
        story.append(Spacer(1, 0.1*inch))
    story.append(PageBreak())
    
    # Conclusion
    story.append(Paragraph("9. Conclusion", heading_style))
    story.append(Spacer(1, 0.1*inch))
    
    story.append(Paragraph("RimToken (RIM) represents the next generation of cryptocurrencies, combining cutting-edge blockchain and artificial intelligence technologies to deliver innovative and secure financial solutions.", body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Why RimToken?", subheading_style))
    why_rim = [
        "1. <b>Advanced Technology:</b> Using latest technologies",
        "2. <b>Distinguished Team:</b> High expertise and proven track record",
        "3. <b>Clear Vision:</b> Defined plan for growth and expansion",
        "4. <b>Positive Impact:</b> Contributing to economic development"
    ]
    
    for reason in why_rim:
        story.append(Paragraph(reason, body_style))
    story.append(Spacer(1, 0.2*inch))
    
    story.append(Paragraph("Call to Action", subheading_style))
    story.append(Paragraph("We invite you to join the digital money revolution with RimToken. Whether you're an investor, developer, or regular user, there's a place for you in our growing community.", body_style))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("<b>Together, we build the future of digital money.</b>", body_style))
    story.append(Spacer(1, 0.5*inch))
    
    # Contact Information
    story.append(Paragraph("Contact Information", subheading_style))
    contact_info = [
        "• Website: www.rimtoken.org",
        "• Email: info@rimtoken.org",
        "• Phone: +37968897",
        "• Telegram: @RimTokenOfficial",
        "• Twitter: @RimToken_RIM"
    ]
    
    for contact in contact_info:
        story.append(Paragraph(contact, body_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Disclaimer
    story.append(Paragraph("Disclaimer", subheading_style))
    story.append(Paragraph("This white paper is for informational purposes only and does not constitute an offer or invitation to buy or sell any securities. Cryptocurrency investment involves risks, and investors should conduct their own research before making any investment decisions.", body_style))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("© 2025 RimToken. All rights reserved.", body_style))
    
    # Build PDF
    doc.build(story)
    print("✅ PDF created successfully: RimToken_WhitePaper.pdf")

if __name__ == "__main__":
    create_rimtoken_whitepaper_pdf()