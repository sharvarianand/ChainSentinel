import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from shared.database import engine, SupplierDB, SupplyRelationshipDB, ComplianceRuleDB
from shared.database import async_session
import uuid


async def seed_suppliers():
    suppliers = [
        {"name": "ShenZhen Electronics Co.", "tier": 1, "region": "China - Guangdong", "trust_score": 72.0},
        {"name": "Shanghai Port Logistics", "tier": 1, "region": "China - Shanghai", "trust_score": 65.0},
        {"name": "TechParts Taiwan", "tier": 1, "region": "Taiwan", "trust_score": 85.0},
        {"name": "Mumbai Textiles Ltd.", "tier": 2, "region": "India - Maharashtra", "trust_score": 58.0},
        {"name": "Vietnam Assembly Corp.", "tier": 2, "region": "Vietnam", "trust_score": 70.0},
        {"name": "Korea Semi Inc.", "tier": 1, "region": "South Korea", "trust_score": 88.0},
        {"name": "German Precision GmbH", "tier": 1, "region": "Germany", "trust_score": 92.0},
        {"name": "Brazil Materials SA", "tier": 2, "region": "Brazil", "trust_score": 61.0},
        {"name": "Mexican Logistics MX", "tier": 2, "region": "Mexico", "trust_score": 67.0},
        {"name": "UK Distribution Ltd.", "tier": 3, "region": "United Kingdom", "trust_score": 78.0},
        {"name": "Japan Quality Corp.", "tier": 1, "region": "Japan", "trust_score": 91.0},
        {"name": "Thai Components Co.", "tier": 2, "region": "Thailand", "trust_score": 63.0},
    ]
    
    async with async_session() as db:
        for s in suppliers:
            supplier = SupplierDB(
                id=uuid.uuid4(),
                name=s["name"],
                tier=s["tier"],
                region=s["region"],
                trust_score=s["trust_score"]
            )
            db.add(supplier)
        
        await db.commit()
        print(f"Seeded {len(suppliers)} suppliers")


async def seed_compliance_rules():
    rules = [
        {
            "name": "Trade Sanctions Check",
            "category": "Trade Regulations",
            "description": "No rerouting through sanctioned countries per OFAC list",
            "rule_logic": {"check_type": "sanctions", "countries": ["IR", "KP", "CU", "SY"]}
        },
        {
            "name": "Dual-Source Policy",
            "category": "Corporate Policy",
            "description": "Any single supplier must not exceed 60% of total volume for a component",
            "rule_logic": {"check_type": "concentration", "max_percentage": 60}
        },
        {
            "name": "Environmental Compliance",
            "category": "Environmental",
            "description": "Alternative routes must not exceed 120% of base carbon footprint",
            "rule_logic": {"check_type": "carbon", "max_multiplier": 1.2}
        },
        {
            "name": "Data Residency",
            "category": "Data Privacy",
            "description": "Supplier data from EU suppliers must not be processed outside EU (GDPR)",
            "rule_logic": {"check_type": "data_residency", "regions": {"EU": "EU"}}
        },
        {
            "name": "Cost Threshold Approval",
            "category": "Corporate Policy",
            "description": "Automated actions exceeding $500K require human approval",
            "rule_logic": {"check_type": "cost", "threshold": 500000}
        }
    ]
    
    async with async_session() as db:
        for r in rules:
            rule = ComplianceRuleDB(
                id=uuid.uuid4(),
                name=r["name"],
                category=r["category"],
                description=r["description"],
                rule_logic=r["rule_logic"]
            )
            db.add(rule)
        
        await db.commit()
        print(f"Seeded {len(rules)} compliance rules")


async def main():
    async with engine.begin() as conn:
        await conn.run_sync(SupplierDB.__table__.create, checkfirst=True)
        await conn.run_sync(SupplyRelationshipDB.__table__.create, checkfirst=True)
        await conn.run_sync(ComplianceRuleDB.__table__.create, checkfirst=True)
    
    await seed_suppliers()
    await seed_compliance_rules()
    print("Seeding complete!")


if __name__ == "__main__":
    asyncio.run(main())
