#!/usr/bin/env python3
"""
Quick search utility for WHO Nutrients in Drinking Water documentation.

Usage:
    python search.py <search_term>
    python search.py "multiple words"
    python search.py --list-topics

Examples:
    python search.py magnesium
    python search.py "cardiovascular disease"
    python search.py --context calcium    # Show surrounding context
"""

import os
import re
import sys
from pathlib import Path

DOCS_DIR = Path(__file__).parent

# Chapter titles for display
CHAPTERS = {
    "00-preface.md": "Preface",
    "00-acknowledgements.md": "Acknowledgements",
    "01-nutrients-in-drinking-water-consensus.md": "Ch 1: Consensus at Meeting",
    "02-desalination-guidelines.md": "Ch 2: Desalination Guidelines",
    "03-water-requirements.md": "Ch 3: Water Requirements",
    "04-essential-nutrients.md": "Ch 4: Essential Nutrients",
    "05-minerals-bioavailability.md": "Ch 5: Bioavailability",
    "06-drinking-water-contribution-us.md": "Ch 6: US Dietary Intakes",
    "07-mineral-elements-cardiovascular.md": "Ch 7: Cardiovascular Health",
    "08-studies-mineral-cardiac-health.md": "Ch 8: Cardiac Health Studies",
    "09-interpreting-epidemiological-associations.md": "Ch 9: Epidemiology",
    "10-water-hardness-cvd-1957-78.md": "Ch 10: CVD Studies 1957-78",
    "11-drinking-water-hardness-cvd-1979-2004.md": "Ch 11: CVD Studies 1979-2004",
    "12-health-risks-demineralised-water.md": "Ch 12: Demineralised Water Risks",
    "13-nutrient-minerals-infants-children.md": "Ch 13: Infants & Children",
    "14-fluoride.md": "Ch 14: Fluoride",
}


def search_docs(query, show_context=False, context_chars=150):
    """Search all markdown files for the query."""
    results = []
    query_lower = query.lower()
    pattern = re.compile(re.escape(query), re.IGNORECASE)

    for filename in sorted(DOCS_DIR.glob("*.md")):
        if filename.name == "README.md" or filename.name == "TOPIC_INDEX.md":
            continue

        content = filename.read_text(encoding='utf-8')
        matches = list(pattern.finditer(content))

        if matches:
            chapter_name = CHAPTERS.get(filename.name, filename.name)
            results.append({
                'file': filename.name,
                'chapter': chapter_name,
                'count': len(matches),
                'matches': matches,
                'content': content
            })

    return sorted(results, key=lambda x: -x['count'])


def print_results(results, query, show_context=False, context_chars=150):
    """Print search results."""
    if not results:
        print(f"No results found for: {query}")
        return

    total = sum(r['count'] for r in results)
    print(f"\n{'='*60}")
    print(f"Found {total} matches for '{query}' in {len(results)} files")
    print(f"{'='*60}\n")

    for r in results:
        print(f"📄 {r['chapter']}")
        print(f"   File: {r['file']} ({r['count']} matches)")

        if show_context:
            # Show first 3 matches with context
            for match in r['matches'][:3]:
                start = max(0, match.start() - context_chars)
                end = min(len(r['content']), match.end() + context_chars)
                snippet = r['content'][start:end]
                # Clean up snippet
                snippet = ' '.join(snippet.split())
                snippet = snippet.replace(query, f"\033[1;33m{query}\033[0m")
                print(f"   └─ ...{snippet}...")
        print()


def list_topics():
    """List all indexed topics."""
    topics = [
        "Minerals: calcium, magnesium, sodium, potassium, iron, copper, zinc, selenium, iodine, fluoride",
        "Health: cardiovascular, heart disease, hypertension, blood pressure, mortality",
        "Water Types: hard water, soft water, demineralized, mineral water, tap water, bottled water, groundwater",
        "Processes: desalination, distillation, osmosis, treatment",
        "Population: infants, children, elderly, pregnancy",
        "Science: bioavailability, absorption, RDA, epidemiology, guidelines",
    ]
    print("\n📚 Common Topics in WHO Water Documentation:\n")
    for topic in topics:
        print(f"  {topic}")
    print("\nUse: python search.py <topic> to search")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    if sys.argv[1] == "--list-topics":
        list_topics()
        sys.exit(0)

    show_context = "--context" in sys.argv or "-c" in sys.argv

    # Get query (excluding flags)
    query_parts = [arg for arg in sys.argv[1:] if not arg.startswith("-")]
    query = " ".join(query_parts)

    if not query:
        print("Please provide a search term")
        sys.exit(1)

    results = search_docs(query, show_context)
    print_results(results, query, show_context)


if __name__ == "__main__":
    main()
