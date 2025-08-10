# Enhanced Duplicate Detection

## Overview
The ANGSPE scraper now uses **dual-layer duplicate detection** to ensure no reports are processed multiple times, even if URLs change or there are minor title variations.

## Detection Methods

### 1. 🔗 **URL-Based Detection**
- Tracks all processed download URLs
- Prevents re-processing same files
- Most reliable for identical documents

### 2. 📝 **Title-Based Detection**
- Normalizes report titles for comparison
- Handles minor variations in punctuation/spacing
- Catches duplicates even with different URLs

## Title Normalization Process

```python
def _normalize_title(self, title):
    """Normalize title for duplicate detection"""
    # 1. Convert to lowercase and strip whitespace
    # 2. Remove most punctuation (keep hyphens/periods)
    # 3. Replace multiple spaces with single space
    # 4. Handle common French variations
    # 5. Return normalized string for comparison
```

### Examples of Normalized Titles:
- `"Rapport sur l'État actionnaire 2023 - 2024"` → `"rapport sur letat actionnaire 2023 - 2024"`
- `"Charte de gouvernance pour les EEP."` → `"charte de gouvernance pour les eep"`

## Enhanced Logging

### Duplicate Detection Messages:
```
🔄 Skipping duplicate by URL: [Title]
   📎 URL already processed: [URL]

🔄 Skipping duplicate by title: [Title]
   📝 Title already processed: [Normalized Title]
```

### Processing Messages:
```
🔄 Checking for duplicates by URL and title...
📄 Processing link 1/3...
✅ Added: [Title]...
📚 Found 2 unique publications (duplicates removed)
```

## Benefits

### ✅ **Robust Detection**
- **URL Changes**: Detects duplicates even if download URLs change
- **Title Variations**: Handles minor punctuation/spacing differences
- **False Positives**: Minimized through intelligent normalization

### ✅ **Clear Logging**
- **Specific Reasons**: Shows why each duplicate was skipped
- **Progress Tracking**: Shows processing status for each item
- **Detailed Info**: Includes URLs and normalized titles for debugging

### ✅ **Performance**
- **Efficient**: O(1) lookup using sets
- **Memory Efficient**: Only stores normalized strings
- **Fast Processing**: No complex comparison algorithms

## Real-World Scenarios Handled

### Scenario 1: Same Report, Different URLs
```
Report 1: "Rapport annuel 2023" → URL: /old/path/rapport2023.pdf
Report 2: "Rapport annuel 2023" → URL: /new/path/rapport2023.pdf
Result: ✅ Second report skipped by title
```

### Scenario 2: Minor Title Variations
```
Report 1: "Charte de gouvernance pour les EEP."
Report 2: "Charte de gouvernance pour les EEP"
Result: ✅ Second report skipped (punctuation normalized)
```

### Scenario 3: URL Changes but Same Content
```
Report 1: Same title, URL: /uploads/file1.pdf
Report 2: Same title, URL: /uploads/file2.pdf  
Result: ✅ Second report skipped by title
```

## Technical Implementation

### Data Structures:
- `seen_urls: set()` - Tracks processed URLs
- `seen_titles: set()` - Tracks normalized titles

### Process Flow:
1. Extract publication info from HTML
2. Normalize title using `_normalize_title()`
3. Check against `seen_urls` set
4. Check against `seen_titles` set
5. If unique, add to both sets and publications list
6. If duplicate, log reason and skip

## Future Enhancements

### Potential Improvements:
- **Fuzzy Matching**: Use Levenshtein distance for similar titles
- **Date Comparison**: Compare publication dates for additional validation
- **File Hash**: Compare actual file content hashes when possible
- **Machine Learning**: Train model to detect semantic duplicates

---

*This enhanced duplicate detection ensures reliable, accurate scraping with comprehensive logging for transparency and debugging.*
