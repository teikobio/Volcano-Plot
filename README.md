# Volcano Plot Webflow Embeds

This repository contains interactive volcano plot visualizations and a statistical summary table, designed for easy embedding into [Webflow](https://webflow.com/) blog posts or landing pages.

## Features

- **Interactive Volcano Plots**  
  - **Untransformed:** Effect size (% price change) vs. statistical significance  
  - **Transformed:** log₂ fold change vs. statistical significance  
  - Hover to see tooltips with area details  
  - Export plots as SVG or PNG

- **Statistical Table**  
  - Sortable, exportable as PNG  
  - Highlights statistically significant results

## Usage

1. **Copy the contents** of each of these:
    - `volcano-plot-untransformed-embed.html`
    - `volcano-plot-transformed-axes.html`
2. **Paste into a Webflow HTML Embed block** on your page.
3. The embed is fully self-contained (includes all necessary CSS and JS).
4. The plots and table are responsive up to 682px wide, matching our ArticleContainer width.

## Files

- `volcano-plot-untransformed-embed.html`  
  *Volcano plot with effect size (% price change) on the x-axis.*

- `volcano-plot-transformed-axes.html`  
  *Volcano plot with log₂ fold change on the x-axis.*

- `volcano-plot.html`  
  *Master file with all code and visualizations (not intended for direct embed).*

## Requirements

- No dependencies except [D3.js](https://d3js.org/) (included via CDN in each embed file).
- Works in all modern browsers.
