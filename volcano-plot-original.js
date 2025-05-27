import { processData } from './data-processor.js';

export function renderVolcanoPlot(container, dataset) {
  // Process the data using the shared processor
  const volcanoData = processData(dataset);

  // Create container HTML
  const containerHTML = `
    <div class="volcano-plot-container">
      <div class="chart-title">Volcano Plot: Effect Size vs Statistical Significance</div>
      <div class="export-controls">
        <button class="export-btn" id="volcano-original-export-svg">Export SVG</button>
        <button class="export-btn" id="volcano-original-export-png">Export PNG</button>
      </div>
      <div id="volcano-original-plot"></div>
      <div class="legend">
        <div class="legend-item">
          <div class="legend-circle" style="background-color: #ff4c4c;"></div>
          <span>Tech Markets (Benefited)</span>
        </div>
        <div class="legend-item">
          <div class="legend-circle" style="background-color: #4cbaff;"></div>
          <span>Manual Towns (Harmed)</span>
        </div>
        <div class="legend-item">
          <div class="legend-circle" style="background-color: #4cff8f;"></div>
          <span>Rural Counties (Neutral)</span>
        </div>
        <div class="legend-item">
          <span style="border-top: 2px dashed #fff; width: 20px; display: inline-block;"></span>
          <span>p = 0.05 (significance threshold)</span>
        </div>
        <div class="legend-item">
          <span style="border-top: 2px dashed #ff9800; width: 20px; display: inline-block;"></span>
          <span>±50% price change threshold</span>
        </div>
      </div>
      <div class="tooltip" id="volcano-original-tooltip"></div>
    </div>
  `;

  // Add styles
  const styles = `
    <style>
      .volcano-plot-container {
        background: #202028;
        border-radius: 12px;
        padding: 24px 0 0 0;
        position: relative;
        max-width: 682px;
        margin: 0 auto;
      }
      .chart-title {
        text-align: center;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 20px;
        color: #fff;
        letter-spacing: 0.01em;
      }
      .export-controls {
        text-align: right;
        margin-bottom: 10px;
        padding-right: 24px;
      }
      .export-btn {
        background: #2c3e50;
        color: #fff;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 8px;
        transition: background 0.2s;
      }
      .export-btn:hover {
        background: #34495e;
      }
      .legend {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        gap: 30px;
        flex-wrap: wrap;
        padding: 0 24px 24px;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #fff;
        font-size: 13px;
      }
      .legend-circle {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
      }
      .tooltip {
        position: absolute;
        padding: 12px 16px;
        background: rgba(30, 30, 40, 0.98);
        color: #fff;
        border-radius: 6px;
        pointer-events: none;
        opacity: 0;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 2px 12px #0008;
        z-index: 9999;
        transition: opacity 0.2s;
        border: 1px solid #444;
      }
      .axis-label,
      .tick text {
        fill: #fff !important;
        font-size: 14px;
        font-weight: 600;
      }
      .tick line,
      .domain {
        stroke: #aaa !important;
      }
    </style>
  `;

  // Add container and styles
  container.innerHTML = styles + containerHTML;

  // Set up D3 plot
  const margin = {top: 40, right: 60, bottom: 80, left: 80};
  const width = 682 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#volcano-original-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Use effectSize (percentage change) instead of log2FoldChange
  const maxAbsEffect = Math.max(
    Math.abs(d3.min(volcanoData, d => d.effectSize)),
    Math.abs(d3.max(volcanoData, d => d.effectSize))
  );
  const xScale = d3.scaleLinear()
    .domain([-maxAbsEffect, maxAbsEffect])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(volcanoData, d => d.negLogP)]).nice()
    .range([height, 0]);

  const colorScale = d3.scaleOrdinal()
    .domain(['tech', 'rural', 'manual'])
    .range(['#ff4c4c', '#4cff8f', '#4cbaff']);

  // Add axes
  g.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("fill", "#fff")
    .style("font-size", "13px");

  g.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll("text")
    .style("fill", "#fff")
    .style("font-size", "13px");

  // Add axis labels
  g.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .style("text-anchor", "middle")
    .style("fill", "#fff")
    .text("Effect Size (% Change)");

  g.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", -height / 2)
    .style("text-anchor", "middle")
    .style("fill", "#fff")
    .text("-log₁₀(p-value)");

  // Add significance threshold line
  const significanceThreshold = -Math.log10(0.05);
  g.append("line")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", yScale(significanceThreshold))
    .attr("y2", yScale(significanceThreshold))
    .attr("stroke", "#fff")
    .attr("stroke-dasharray", "5,5")
    .attr("stroke-width", 2);

  // Add vertical line at x=0
  g.append("line")
    .attr("x1", xScale(0))
    .attr("x2", xScale(0))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  // Add effect size threshold lines (±50%)
  if (xScale(50) <= width) {
    g.append("line")
      .attr("x1", xScale(50))
      .attr("x2", xScale(50))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#ff9800")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.7);
  }

  if (xScale(-50) >= 0) {
    g.append("line")
      .attr("x1", xScale(-50))
      .attr("x2", xScale(-50))
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#ff9800")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 1.5)
      .attr("opacity", 0.7);
  }

  // Add threshold labels
  if (xScale(50) <= width) {
    g.append("text")
      .attr("x", xScale(50))
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("fill", "#ff9800")
      .text("+50%");
  }

  if (xScale(-50) >= 0) {
    g.append("text")
      .attr("x", xScale(-50))
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "500")
      .style("fill", "#ff9800")
      .text("-50%");
  }

  // Add tooltip
  const tooltip = d3.select("#volcano-original-tooltip");

  // Add data points
  g.selectAll(".dot")
    .data(volcanoData)
    .enter().append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.effectSize))
    .attr("cy", d => yScale(d.negLogP))
    .attr("r", 9)
    .attr("fill", d => colorScale(d.type))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      const [mouseX, mouseY] = d3.pointer(event, document.querySelector('.volcano-plot-container'));
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip.html(
        `<strong>${d.area}</strong><br/>
        Type: ${d.type}<br/>
        Effect Size: ${d.effectSize.toFixed(2)}%<br/>
        log₂ FC: ${d.log2FoldChange.toFixed(3)}<br/>
        p-value: ${d.pValue.toFixed(4)}<br/>
        Sample Size: ${d.sampleSize}<br/>
        ${d.significant ? '<strong>Statistically Significant</strong>' : 'Not Significant'}`
      )
      .style("left", (mouseX + 20) + "px")
      .style("top", (mouseY - 10) + "px");
      d3.select(this).attr("r", 12);
    })
    .on("mouseout", function() {
      tooltip.transition().duration(300).style("opacity", 0);
      d3.select(this).attr("r", 9);
    });

  // Add area labels
  g.selectAll(".label")
    .data(volcanoData)
    .enter().append("text")
    .attr("class", "label")
    .attr("x", d => xScale(d.effectSize))
    .attr("y", d => yScale(d.negLogP) - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("font-weight", "600")
    .style("fill", "#fff")
    .text(d => d.area.length <= 8 ? d.area : d.area.replace(' County', ''));

  // Add export functionality
  document.getElementById('volcano-original-export-svg').addEventListener('click', () => {
    const svgEl = document.querySelector("#volcano-original-plot svg");
    if (!svgEl) return alert('SVG not found');
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgEl);
    if (!svgString.startsWith('<?xml')) svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
    downloadFile(svgString, 'volcano-plot-original.svg', 'image/svg+xml');
  });

  document.getElementById('volcano-original-export-png').addEventListener('click', () => {
    const svgEl = document.querySelector("#volcano-original-plot svg");
    if (!svgEl) return alert('SVG not found');
    const svgRect = svgEl.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const scale = 2;
    canvas.width = svgRect.width * scale;
    canvas.height = svgRect.height * scale;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#202028';
    ctx.fillRect(0, 0, svgRect.width, svgRect.height);
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    const img = new Image();
    img.onload = function() {
      ctx.drawImage(img, 0, 0, svgRect.width, svgRect.height);
      canvas.toBlob(function(blob) {
        downloadFile(blob, 'volcano-plot-original.png', 'image/png');
      }, 'image/png');
    };
    img.onerror = function() { alert('PNG conversion failed. Try SVG export instead.'); };
    img.src = svgDataUrl;
  });
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 