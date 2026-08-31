import datetime
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER

def generate_report(results, total_contracts=2):

    doc = SimpleDocTemplate("legal_report.pdf", pagesize=letter,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=40)

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=18,
        alignment=TA_CENTER,
        spaceAfter=20
    )
    
    sub_title_style = ParagraphStyle(
        'SubTitleStyle',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=20
    )

    elements = []

    # Title
    elements.append(Paragraph("<b>LEGAL ORACLE</b>", title_style))
    elements.append(Paragraph("<b>CONTRACT ANALYSIS REPORT</b>", title_style))
    elements.append(Spacer(1, 10))

    # Summary
    today = datetime.datetime.now().strftime("%d %B %Y")
    elements.append(Paragraph(f"<b>Total Contracts Analyzed :</b> {total_contracts} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Report Date :</b> {today}", sub_title_style))
    elements.append(Paragraph(f"<b>Total Contradictions Found :</b> {len(results)}", sub_title_style))
    elements.append(Spacer(1, 20))

    for index, item in enumerate(results):
        # Heading
        heading_text = f"<font color='red'><b>{index + 1}. CONTRADICTION DETECTED</b></font>"
        risk_color = "#EF4444" if item.get('risk_level') == "HIGH" else ("#F97316" if item.get('risk_level') == "MEDIUM" else "#22C55E")
        
        # We will create a small table for the heading and risk badge
        heading_data = [[
            Paragraph(heading_text, styles['Heading3']),
            Paragraph(f"<font color='white'><b>  RISK LEVEL: {item.get('risk_level')}  </b></font>", ParagraphStyle('Badge', parent=styles['Normal'], backColor=colors.HexColor(risk_color), textColor=colors.white, alignment=2, borderPadding=4))
        ]]
        
        heading_table = Table(heading_data, colWidths=['70%', '30%'])
        heading_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 10)
        ]))
        elements.append(heading_table)

        # Clauses Table
        clause_data = [
            [Paragraph("<b>Contract A Clause</b>", styles['Normal']), Paragraph("<b>Contract B Clause</b>", styles['Normal'])],
            [Paragraph(item.get('clause1', ''), styles['Normal']), Paragraph(item.get('clause2', ''), styles['Normal'])]
        ]
        
        clause_table = Table(clause_data, colWidths=['50%', '50%'])
        clause_table.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 8)
        ]))
        elements.append(clause_table)
        elements.append(Spacer(1, 10))

        # AI Analysis Table
        analysis_data = [
            [Paragraph("<b>AI Analysis</b>", styles['Normal'])],
            [Paragraph(item.get('ai_explanation', ''), styles['Normal'])]
        ]
        
        if item.get('ai_recommendation'):
             analysis_data.append([Paragraph("<b>Recommendation</b>", styles['Normal'])])
             analysis_data.append([Paragraph(item.get('ai_recommendation', ''), styles['Normal'])])

        analysis_table = Table(analysis_data, colWidths=['100%'])
        analysis_table.setStyle(TableStyle([
            ('GRID', (0,0), (-1,-1), 1, colors.black),
            ('BACKGROUND', (0,0), (0,0), colors.whitesmoke),
            ('BACKGROUND', (0,2), (0,2), colors.whitesmoke) if len(analysis_data) > 2 else ('BACKGROUND', (0,0), (0,0), colors.whitesmoke),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('PADDING', (0,0), (-1,-1), 8)
        ]))
        elements.append(analysis_table)

        elements.append(Spacer(1, 30))

    doc.build(elements)

    return "legal_report.pdf"
