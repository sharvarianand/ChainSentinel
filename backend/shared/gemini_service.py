import google.generativeai as genai
from typing import Optional, List, Dict, Any
import json
import logging
from shared.config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.model = None
        self._initialized = False

    def initialize(self):
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            self._initialized = True
            logger.info("Gemini API initialized successfully")
        else:
            logger.warning("No Gemini API key provided - using mock responses")

    async def generate_response(self, prompt: str) -> str:
        if not self._initialized:
            return self._mock_response(prompt)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return self._mock_response(prompt)

    async def classify_disruption(self, text: str) -> Dict[str, Any]:
        prompt = f"""
Analyze the following news/alert text and classify it as a supply chain disruption.
Return a JSON object with these fields:
- is_disruption: boolean
- disruption_type: one of [port_strike, weather, geopolitical, supplier_default, logistics_failure, regulatory, natural_disaster]
- severity: one of [critical, high, medium, low]
- affected_regions: list of geographic regions
- confidence: float between 0 and 1
- summary: brief summary of the disruption

Text to analyze:
{text}

Return only valid JSON, no other text.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return self._mock_disruption_classification()

    async def extract_entities(self, text: str) -> Dict[str, Any]:
        prompt = f"""
Extract entities from the following supply chain related text.
Return a JSON object with these fields:
- suppliers: list of supplier/company names mentioned
- locations: list of geographic locations
- products: list of products or materials mentioned
- dates: list of dates or time periods mentioned
- ports: list of ports mentioned
- key_events: list of key events described

Text:
{text}

Return only valid JSON, no other text.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "suppliers": [],
                "locations": [],
                "products": [],
                "dates": [],
                "ports": [],
                "key_events": []
            }

    async def generate_negotiation_proposal(
        self, 
        supplier_name: str,
        supplier_history: Dict[str, Any],
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        prompt = f"""
You are a supply chain negotiation expert. Generate a negotiation proposal for the following situation:

Supplier: {supplier_name}
Historical Performance: {json.dumps(supplier_history)}
Current Context: {json.dumps(context)}

Return a JSON object with:
- opening_proposal: object with price_adjustment_pct, delivery_timeline_days, volume_commitment
- rationale: explanation for the proposal
- fallback_position: alternative terms if initial is rejected
- best_alternative: BATNA if negotiation fails

Return only valid JSON.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return self._mock_negotiation_proposal()

    async def simulate_counter_offers(
        self,
        proposal: Dict[str, Any],
        supplier_profile: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        prompt = f"""
Simulate likely counter-offers from a supplier given the following:

Initial Proposal: {json.dumps(proposal)}
Supplier Profile: {json.dumps(supplier_profile)}

Return a JSON array of 2-3 likely counter-offers, each with:
- terms: the counter-offer terms
- probability: likelihood of this counter-offer (0-1)
- response_strategy: how to respond

Return only valid JSON array.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return []

    async def analyze_risk_cascade(
        self,
        disruption: Dict[str, Any],
        affected_suppliers: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        prompt = f"""
Analyze the cascade risk of the following disruption through the supply chain:

Disruption: {json.dumps(disruption)}
Affected Suppliers: {json.dumps(affected_suppliers)}

Return a JSON object with:
- cascade_probability: float 0-1
- estimated_delay_days: int
- financial_impact_estimate: object with low, medium, high scenarios
- recommended_immediate_actions: list of actions
- long_term_mitigations: list of mitigations

Return only valid JSON.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return self._mock_risk_analysis()

    async def generate_compliance_explanation(
        self,
        action: Dict[str, Any],
        rule: Dict[str, Any],
        result: str
    ) -> str:
        prompt = f"""
Generate a clear explanation for a compliance check result:

Action: {json.dumps(action)}
Rule: {json.dumps(rule)}
Result: {result}

Provide a 2-3 sentence explanation of why the action passed or failed the compliance check.
"""
        return await self.generate_response(prompt)

    async def discover_patterns(
        self,
        historical_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        prompt = f"""
Analyze the following historical supply chain events and discover patterns:

Events: {json.dumps(historical_data[:50])}

Return a JSON array of discovered patterns, each with:
- pattern_description: description of the pattern
- confidence: float 0-1
- supporting_data_points: number of events supporting this
- actionable_recommendation: what action to take

Return only valid JSON array.
"""
        response = await self.generate_response(prompt)
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return []

    def _mock_response(self, prompt: str) -> str:
        return "Mock response - Gemini API not configured"

    def _mock_disruption_classification(self) -> Dict[str, Any]:
        return {
            "is_disruption": True,
            "disruption_type": "port_strike",
            "severity": "high",
            "affected_regions": ["Shanghai, China"],
            "confidence": 0.85,
            "summary": "Port operations disrupted due to labor action"
        }

    def _mock_negotiation_proposal(self) -> Dict[str, Any]:
        return {
            "opening_proposal": {
                "price_adjustment_pct": -5.0,
                "delivery_timeline_days": 14,
                "volume_commitment": 1000
            },
            "rationale": "Based on historical relationship and current market conditions",
            "fallback_position": {
                "price_adjustment_pct": -2.0,
                "delivery_timeline_days": 21,
                "volume_commitment": 500
            },
            "best_alternative": "Activate backup supplier with 10% cost increase"
        }

    def _mock_risk_analysis(self) -> Dict[str, Any]:
        return {
            "cascade_probability": 0.78,
            "estimated_delay_days": 21,
            "financial_impact_estimate": {
                "low": 500000,
                "medium": 2300000,
                "high": 5000000
            },
            "recommended_immediate_actions": [
                "Contact alternative suppliers",
                "Expedite in-transit shipments",
                "Notify affected customers"
            ],
            "long_term_mitigations": [
                "Diversify supplier base",
                "Increase safety stock levels",
                "Establish backup routing options"
            ]
        }


gemini_service = GeminiService()
