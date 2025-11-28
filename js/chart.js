class ChartModal {
    constructor() {
        this.chartButton = document.getElementById('chart-button');
        this.chartModal = document.getElementById('chart-modal');
        this.chartClose = document.querySelector('.chart-modal-close');
        this.chartContainer = document.getElementById('chart-container');
        this.chart = null;
        
        this.init();
    }

    init() {
        // Ensure modal is hidden on page load
        this.closeModal();
        
        // Add event listeners
        this.addEventListeners();
    }

    addEventListeners() {
        if (this.chartButton) {
            this.chartButton.addEventListener('click', () => this.openModal());
        }
        
        if (this.chartClose) {
            this.chartClose.addEventListener('click', () => this.closeModal());
        }

        if (this.chartModal) {
            // Close modal when clicking outside
            this.chartModal.addEventListener('click', (e) => {
                if (e.target === this.chartModal) {
                    this.closeModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.chartModal && this.chartModal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    async loadDestinations() {
        try {
            const response = await fetch('data/destination.json');
            const data = await response.json();
            return data.destinations;
        } catch (error) {
            console.error('Error loading destinations:', error);
            return [];
        }
    }

    parseDistance(distanceStr) {
        // Parse distance strings like "384,400 KM", "225 MIL. KM", "628 MIL. KM", "1.6 BIL. KM"
        const numericPart = distanceStr.split(' ')[0].replace(',', '');
        
        if (distanceStr.includes('BIL')) {
            return parseFloat(numericPart) * 1000000000; // Billion
        } else if (distanceStr.includes('MIL')) {
            return parseFloat(numericPart) * 1000000; // Million
        } else {
            return parseFloat(numericPart); // Regular number
        }
    }

    parseTravelTime(travelTimeStr) {
        // Parse travel time strings like "3 DAYS", "9 MONTHS", "3 YEARS", "7 YEARS"
        const numericPart = parseInt(travelTimeStr.split(' ')[0]);
        
        if (travelTimeStr.includes('YEAR')) {
            return numericPart * 365; // Convert years to days
        } else if (travelTimeStr.includes('MONTH')) {
            return numericPart * 30; // Convert months to days (approximate)
        } else {
            return numericPart; // Days
        }
    }

    async createChart() {
        if (!this.chartContainer) return;
        
        const destinations = await this.loadDestinations();
        
        const names = destinations.map(d => d.name);
        const distances = destinations.map(d => this.parseDistance(d.distance));
        const travelTimes = destinations.map(d => this.parseTravelTime(d.travelTime));
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        this.chart = c3.generate({
            bindto: '#chart-container',
            data: {
                columns: [
                    ['Distance (km)', ...distances],
                    ['Travel Time (days)', ...travelTimes]
                ],
                type: 'bar',
                axes: {
                    'Travel Time (days)': 'y2'
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: names
                },
                y: {
                    label: {
                        text: 'Distance (km)',
                        position: 'outer-middle'
                    },
                    tick: {
                        format: d3.format('.2e') // Scientific notation for large numbers
                    }
                },
                y2: {
                    show: true,
                    label: {
                        text: 'Travel Time (days)',
                        position: 'outer-middle'
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            color: {
                pattern: ['#00d9ff', '#ff6b6b']
            },
            tooltip: {
                format: {
                    title: function (x) { return x; },
                    value: function (value, ratio, id) {
                        if (id === 'Distance (km)') {
                            return value.toLocaleString() + ' km';
                        } else {
                            return value + ' days';
                        }
                    }
                }
            },
            legend: {
                position: 'bottom'
            },
            size: {
                height: 400,
                width: 800
            }
        });
    }

    openModal() {
        if (this.chartModal) {
            this.chartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Create chart when modal opens
            this.createChart();
        }
    }

    closeModal() {
        if (this.chartModal) {
            this.chartModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// Initialize chart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ChartModal();
});