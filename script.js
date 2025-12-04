/**
 * LÓGICA MATEMÁTICA E PROJEÇÃO 3D
 * Funções puras para gerar vértices e projetá-los em 2D
 */
const GeometryMath = {
    project: (v, width, height, rotation) => {
        let x = v.x;
        let y = v.y;
        let z = v.z;

        // Rotação Eixo Y
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotação Eixo X
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspectiva
        const scale = 400 / (4 + z2); 
        return {
            x: x1 * scale + width / 2,
            y: y2 * scale + height / 2,
            z: z2 
        };
    },

    generateCube: (size) => {
        const s = size / 2;
        const vertices = [
            {x:-s, y:-s, z:-s}, {x:s, y:-s, z:-s}, {x:s, y:s, z:-s}, {x:-s, y:s, z:-s},
            {x:-s, y:-s, z:s},  {x:s, y:-s, z:s},  {x:s, y:s, z:s},  {x:-s, y:s, z:s}
        ];
        const edges = [
            [0,1], [1,2], [2,3], [3,0], // Fundo
            [4,5], [5,6], [6,7], [7,4], // Frente
            [0,4], [1,5], [2,6], [3,7]  // Conexões
        ];
        const faces = [
            [0,1,2,3], [4,5,6,7], [0,1,5,4], [2,3,7,6], [0,3,7,4], [1,2,6,5]
        ];
        return { vertices, edges, faces, type: 'polyhedron', subtype: 'cube' };
    },

    generatePrismTriangular: (baseSize, height) => {
        const h = height / 2;
        const r = baseSize / Math.sqrt(3); 
        const vertices = [];
        for(let i=0; i<3; i++) {
            const angle = (i * 120 - 90) * Math.PI / 180; 
            vertices.push({ x: r * Math.cos(angle), y: -h, z: r * Math.sin(angle) });
        }
        for(let i=0; i<3; i++) {
            const angle = (i * 120 - 90) * Math.PI / 180;
            vertices.push({ x: r * Math.cos(angle), y: h, z: r * Math.sin(angle) });
        }
        const edges = [[0,1], [1,2], [2,0], [3,4], [4,5], [5,3], [0,3], [1,4], [2,5]];
        const faces = [[0,1,2], [3,5,4], [0,3,4,1], [1,4,5,2], [2,5,3,0]];
        return { vertices, edges, faces, type: 'polyhedron', subtype: 'prism_tri' };
    },

    generatePyramid: (baseSize, height) => {
        const s = baseSize / 2;
        const h = height / 2;
        const vertices = [
            {x:-s, y:h, z:-s}, {x:s, y:h, z:-s}, {x:s, y:h, z:s}, {x:-s, y:h, z:s}, {x:0, y:-h, z:0} 
        ];
        const edges = [[0,1], [1,2], [2,3], [3,0], [0,4], [1,4], [2,4], [3,4]];
        const faces = [[0,1,2,3], [0,1,4], [1,2,4], [2,3,4], [3,0,4]];
        return { vertices, edges, faces, type: 'polyhedron', subtype: 'pyramid' };
    },

    generateOctahedron: (size) => {
        const r = size / 1.5; 
        const vertices = [{x: r, y:0, z:0}, {x: -r, y:0, z:0}, {x: 0, y:r, z:0}, {x: 0, y:-r, z:0}, {x: 0, y:0, z:r}, {x: 0, y:0, z:-r}];
        const edges = [[0,2], [0,3], [0,4], [0,5], [1,2], [1,3], [1,4], [1,5], [2,4], [4,3], [3,5], [5,2]];
        const faces = [[0,2,4], [0,4,3], [0,3,5], [0,5,2], [1,2,5], [1,5,3], [1,3,4], [1,4,2]];
        return { vertices, edges, faces, type: 'polyhedron', subtype: 'octahedron' };
    },

    generateDodecahedron: (size) => {
        const s = size * 0.4;
        const phi = (1 + Math.sqrt(5)) / 2;
        const vertices = [];
        for(let x of [-1, 1]) for(let y of [-1, 1]) for(let z of [-1, 1]) vertices.push({x: x*s, y: y*s, z: z*s});
        for(let i of [-1, 1]) for(let j of [-1, 1]) vertices.push({x:0, y: i*s*phi, z: j*s/phi});
        for(let i of [-1, 1]) for(let j of [-1, 1]) vertices.push({x: i*s/phi, y: 0, z: j*s*phi});
        for(let i of [-1, 1]) for(let j of [-1, 1]) vertices.push({x: i*s*phi, y: j*s/phi, z: 0});
        
        const edges = [];
        for(let i=0; i<vertices.length; i++) {
            for(let j=i+1; j<vertices.length; j++) {
                const dist = Math.sqrt((vertices[i].x-vertices[j].x)**2 + (vertices[i].y-vertices[j].y)**2 + (vertices[i].z-vertices[j].z)**2);
                if (Math.abs(dist - (2*s)/phi) < 0.01) edges.push([i, j]);
            }
        }
        return { vertices, edges, faces: [], type: 'polyhedron', subtype: 'dodecahedron' };
    },

    generateCylinder: (r, h, segments = 24) => {
        const vertices = [];
        const edges = [];
        const hh = h/2;
        for(let i=0; i<segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            vertices.push({x: Math.cos(theta)*r, y: -hh, z: Math.sin(theta)*r}); 
            vertices.push({x: Math.cos(theta)*r, y: hh, z: Math.sin(theta)*r});  
        }
        for(let i=0; i<segments; i++) {
            const tC = i * 2; const tN = ((i + 1) % segments) * 2;
            const bC = i * 2 + 1; const bN = ((i + 1) % segments) * 2 + 1;
            edges.push([tC, tN]); edges.push([bC, bN]); 
            if (i % 4 === 0) edges.push([tC, bC]);
        }
        return { vertices, edges, faces: [], type: 'round', subtype: 'cylinder' };
    },

    generateCone: (r, h, segments = 24) => {
        const vertices = [{x: 0, y: -hh, z: 0}]; 
        const edges = [];
        const hh = h/2;
        vertices[0].y = -hh;
        for(let i=0; i<segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            vertices.push({x: Math.cos(theta)*r, y: hh, z: Math.sin(theta)*r});
        }
        for(let i=1; i<=segments; i++) {
            const next = (i % segments) + 1;
            edges.push([i, next]);
            if (i % 4 === 0) edges.push([0, i]);
        }
        return { vertices, edges, faces: [], type: 'round', subtype: 'cone' };
    },

    generateSphere: (r, segments = 16) => {
        const vertices = [];
        const edges = [];
        for(let lat=0; lat <= segments; lat++) {
            const theta = lat * Math.PI / segments;
            for(let lon=0; lon <= segments; lon++) {
                const phi = lon * 2 * Math.PI / segments;
                vertices.push({x: r * Math.sin(theta) * Math.cos(phi), y: r * Math.cos(theta), z: r * Math.sin(theta) * Math.sin(phi)});
            }
        }
        for(let i=0; i<vertices.length; i++) {
            if (i + 1 < vertices.length && (i+1) % (segments+1) !== 0) edges.push([i, i+1]);
            if (i + segments + 1 < vertices.length) edges.push([i, i+segments+1]);
        }
        return { vertices, edges, faces: [], type: 'round', subtype: 'sphere' };
    }
};

/**
 * CLASSE DA APLICAÇÃO (CONTROLADOR)
 * Gerencia o Estado, Eventos do DOM e Renderização
 */
class App {
    constructor() {
        // Estado inicial
        this.state = {
            activeTab: 'polyhedra',
            selectedShape: 'cube',
            showVertices: true,
            showEdges: true,
            showFaces: true,
            showAux: true,
            autoRotate: true,
            rotation: { x: 0.5, y: 0.5 },
            dim1: 1.5,
            dim2: 2
        };

        // Referências do DOM
        this.canvas = document.getElementById('geometry-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDragging = false;
        this.lastMouse = { x: 0, y: 0 };
        
        // Inicialização
        this.initListeners();
        this.resizeCanvas();
        this.animate();
        this.updateUI();
        
        // Renderizar ícones Lucide
        lucide.createIcons();
    }

    // --- Lógica de Estado e UI ---

    setTab(tab) {
        this.state.activeTab = tab;
        this.state.selectedShape = tab === 'polyhedra' ? 'cube' : 'cylinder';
        this.updateUI();
    }

    setShape(shape) {
        this.state.selectedShape = shape;
        this.updateUI();
    }

    setDimension(dimIndex, value) {
        if(dimIndex === 1) this.state.dim1 = parseFloat(value);
        if(dimIndex === 2) this.state.dim2 = parseFloat(value);
        this.updateUI();
    }

    toggleVisual(key) {
        const map = {
            'vertices': 'showVertices',
            'edges': 'showEdges',
            'faces': 'showFaces',
            'aux': 'showAux'
        };
        this.state[map[key]] = !this.state[map[key]];
        this.updateUI();
    }

    toggleAutoRotate() {
        this.state.autoRotate = !this.state.autoRotate;
        this.updateUI();
    }

    toggleModal(show) {
        const modal = document.getElementById('info-modal');
        if(show) modal.classList.remove('hidden-custom');
        else modal.classList.add('hidden-custom');
    }

    // Atualiza todo o DOM com base no Estado atual
    updateUI() {
        const s = this.state;
        
        // 1. Atualizar Botões de Aba
        const btnPoly = document.getElementById('btn-tab-polyhedra');
        const btnRound = document.getElementById('btn-tab-round');
        
        if (s.activeTab === 'polyhedra') {
            btnPoly.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow-sm text-indigo-600";
            btnRound.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all text-gray-500 hover:text-gray-700";
            document.getElementById('group-polyhedra').classList.remove('hidden-custom');
            document.getElementById('group-round').classList.add('hidden-custom');
        } else {
            btnPoly.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all text-gray-500 hover:text-gray-700";
            btnRound.className = "px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-white shadow-sm text-indigo-600";
            document.getElementById('group-polyhedra').classList.add('hidden-custom');
            document.getElementById('group-round').classList.remove('hidden-custom');
        }

        // 2. Atualizar Botões de Forma (Estilo Ativo)
        document.querySelectorAll('.shape-btn').forEach(btn => {
            const isActive = btn.dataset.shape === s.selectedShape;
            btn.className = `shape-btn flex flex-col items-center justify-center p-2 w-14 h-14 rounded-xl transition-all shrink-0 ${isActive ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`;
        });

        // 3. Atualizar Botões de Toggle (Visualização)
        const updateToggleBtn = (id, active, colorClass) => {
            const btn = document.getElementById(id);
            btn.className = `flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-colors w-full ${active ? 'bg-gray-100 text-gray-900 ring-1 ring-gray-300' : 'text-gray-400 hover:text-gray-600'}`;
            btn.querySelector('div').className = `w-2 h-2 rounded-full ${active ? colorClass : 'bg-gray-300'}`;
        };
        updateToggleBtn('btn-toggle-vertices', s.showVertices, 'bg-red-500');
        updateToggleBtn('btn-toggle-edges', s.showEdges, 'bg-slate-800');
        updateToggleBtn('btn-toggle-faces', s.showFaces, 'bg-blue-400');
        updateToggleBtn('btn-toggle-aux', s.showAux, 'bg-amber-500');

        // Desabilitar toggles irrelevantes
        document.getElementById('btn-toggle-vertices').disabled = (s.selectedShape === 'sphere' || s.selectedShape === 'cylinder');
        document.getElementById('btn-toggle-edges').disabled = (s.selectedShape === 'sphere');
        document.getElementById('btn-toggle-aux').disabled = !['pyramid', 'cone', 'cylinder'].includes(s.selectedShape);

        // 4. Ícone Play/Pause
        const iconContainer = document.getElementById('icon-play-pause');
        iconContainer.innerHTML = s.autoRotate ? `<i data-lucide="pause" class="w-6 h-6"></i>` : `<i data-lucide="play" class="w-6 h-6 ml-1"></i>`;
        lucide.createIcons();

        // 5. Atualizar Dados e Textos
        const info = this.getMathInfo();
        document.getElementById('info-title').innerText = info.title;
        document.getElementById('info-desc').innerText = info.desc;
        document.getElementById('info-type-badge').innerText = s.activeTab === 'polyhedra' ? 'Poliedro' : 'Corpo Redondo';
        document.getElementById('info-type-badge').className = `px-2 py-1 rounded-full text-xs font-semibold ${s.activeTab === 'polyhedra' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`;

        document.getElementById('val-v').innerText = info.elements.v;
        document.getElementById('val-a').innerText = info.elements.a;
        document.getElementById('val-f').innerText = info.elements.f;

        // Estilos condicionais para caixas de estatística
        const setStatStyle = (id, active) => {
            const el = document.getElementById(id);
            el.className = `text-center p-2 rounded-lg border ${active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-transparent opacity-50'}`;
        };
        setStatStyle('stat-v-box', s.showVertices);
        setStatStyle('stat-a-box', s.showEdges);
        setStatStyle('stat-f-box', s.showFaces);

        // Fórmulas e Cálculos
        document.getElementById('formula-vol').innerText = info.volFormula;
        document.getElementById('calc-vol').innerText = info.calcVol;
        document.getElementById('formula-area').innerText = info.areaFormula;
        document.getElementById('calc-area').innerText = info.calcArea;

        // 6. Gerar Controles Deslizantes (Sliders) dinamicamente
        const controlsContainer = document.getElementById('dimensions-controls');
        controlsContainer.innerHTML = '';
        info.vars.forEach((v, idx) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="flex justify-between text-xs mb-1">
                    <label class="font-medium text-gray-700">${v.label}</label>
                    <span class="text-gray-500">${v.val} un</span>
                </div>
                <input type="range" min="1" max="4" step="0.1" value="${v.val}" 
                    oninput="app.setDimension(${idx === 0 ? 1 : 2}, this.value)" 
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600">
            `;
            controlsContainer.appendChild(div);
        });

        // 7. Legendas
        const legContainer = document.getElementById('legends-container');
        if (info.legends) {
            legContainer.classList.remove('hidden-custom');
            legContainer.innerHTML = `
                <div class="flex items-center gap-2 mb-2 text-indigo-600"><i data-lucide="book-open" class="w-3 h-3"></i><span class="text-xs font-bold uppercase tracking-wider">Legenda</span></div>
                <div class="grid grid-cols-2 gap-2">
                    ${info.legends.map(l => `<div class="flex items-center gap-2 text-xs text-gray-600"><span class="font-serif font-bold italic bg-gray-100 w-6 h-6 flex items-center justify-center rounded text-gray-800">${l.sym}</span><span>{l.text}</span></div>`).join('')}
                </div>
            `;
            lucide.createIcons(); // Re-renderizar ícone na legenda
        } else {
            legContainer.classList.add('hidden-custom');
        }
    }

    // --- Lógica de Dados Matemáticos ---

    getMathInfo() {
        const s = this.state;
        const d1 = s.dim1;
        const d2 = s.dim2;
        const pi = Math.PI;

        switch(s.selectedShape) {
            case 'cube':
                return { title: 'Cubo', desc: 'Poliedro regular com 6 faces quadradas.', elements: { v: 8, a: 12, f: 6 }, volFormula: 'V = l³', areaFormula: 'A_t = 6l²', legends: [{ sym: 'l', text: 'Aresta' }], calcVol: Math.pow(d1, 3).toFixed(2), calcArea: (6 * Math.pow(d1, 2)).toFixed(2), vars: [{label: 'Aresta', val: d1}] };
            case 'prism_tri':
                const ab = (Math.sqrt(3)/4) * Math.pow(d1, 2); 
                return { title: 'Prisma Triangular', desc: 'Prisma com bases triangulares paralelas.', elements: { v: 6, a: 9, f: 5 }, volFormula: 'V = A_b · h', areaFormula: 'A_t = 2A_b + 3lh', legends: [{ sym: 'l', text: 'Base' }, { sym: 'h', text: 'Altura' }], calcVol: (ab * d2).toFixed(2), calcArea: (2*ab + 3*d1*d2).toFixed(2), vars: [{label: 'Base', val: d1}, {label: 'Altura', val: d2}] };
            case 'pyramid':
                const sh = Math.sqrt(Math.pow(d1/2, 2) + Math.pow(d2, 2));
                const areaBase = d1 * d1;
                return { title: 'Pirâmide Quad.', desc: 'Base quadrada e faces laterais triangulares.', elements: { v: 5, a: 8, f: 5 }, volFormula: 'V = (l² · h) / 3', areaFormula: 'A_t = l² + 2lg', legends: [{ sym: 'h', text: 'Altura' }, { sym: 'l', text: 'Base' }, { sym: 'g', text: 'Apótema' }], calcVol: ((areaBase * d2) / 3).toFixed(2), calcArea: (areaBase + 4 * ((d1 * sh) / 2)).toFixed(2), vars: [{label: 'Base', val: d1}, {label: 'Altura', val: d2}] };
            case 'octahedron':
                return { title: 'Octaedro Regular', desc: 'Um dos Sólidos de Platão. 8 faces triangulares.', elements: { v: 6, a: 12, f: 8 }, volFormula: 'V = (√2/3) · a³', areaFormula: 'A = 2√3 · a²', legends: [{ sym: 'a', text: 'Aresta' }], calcVol: ((Math.sqrt(2)/3) * Math.pow(d1, 3)).toFixed(2), calcArea: (2 * Math.sqrt(3) * Math.pow(d1, 2)).toFixed(2), vars: [{label: 'Aresta', val: d1}] };
            case 'dodecahedron':
                return { title: 'Dodecaedro', desc: 'Sólido de Platão com 12 faces pentagonais.', elements: { v: 20, a: 30, f: 12 }, volFormula: 'V ≈ 7.66 · a³', areaFormula: 'A ≈ 20.65 · a²', legends: [{ sym: 'a', text: 'Aresta' }], calcVol: (7.663 * Math.pow(d1, 3)).toFixed(2), calcArea: (20.646 * Math.pow(d1, 2)).toFixed(2), vars: [{label: 'Aresta', val: d1}] };
            case 'cylinder':
                return { title: 'Cilindro', desc: 'Bases circulares paralelas e congruentes.', elements: { v: 0, a: 0, f: '3*' }, volFormula: 'V = π · r² · h', areaFormula: 'A_t = 2πr(r + h)', legends: [{ sym: 'r', text: 'Raio' }, { sym: 'h', text: 'Altura' }], calcVol: (pi * (d1/2)**2 * d2).toFixed(2), calcArea: (2 * pi * (d1/2) * ((d1/2) + d2)).toFixed(2), vars: [{label: 'Diâmetro', val: d1}, {label: 'Altura', val: d2}] };
            case 'cone':
                const g = Math.sqrt((d1/2)**2 + d2**2);
                return { title: 'Cone', desc: 'Base circular e um vértice (ápice).', elements: { v: 1, a: 0, f: '2*' }, volFormula: 'V = (πr²h) / 3', areaFormula: 'A_t = πr(r + g)', legends: [{ sym: 'r', text: 'Raio' }, { sym: 'h', text: 'Altura' }, { sym: 'g', text: 'Geratriz' }], calcVol: ((pi * (d1/2)**2 * d2) / 3).toFixed(2), calcArea: (pi * (d1/2) * ((d1/2) + g)).toFixed(2), vars: [{label: 'Diâmetro', val: d1}, {label: 'Altura', val: d2}] };
            case 'sphere':
                return { title: 'Esfera', desc: 'Pontos equidistantes do centro.', elements: { v: 0, a: 0, f: 1 }, volFormula: 'V = (4/3)πr³', areaFormula: 'A = 4πr²', legends: [{ sym: 'r', text: 'Raio' }], calcVol: ((4/3) * pi * (d1/1.5)**3).toFixed(2), calcArea: (4 * pi * (d1/1.5)**2).toFixed(2), vars: [{label: 'Tamanho', val: d1}] };
            default: return {};
        }
    }

    // --- Lógica de Renderização e Animação ---

    resizeCanvas() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
        this.canvas.height = parent.clientHeight * (window.devicePixelRatio || 1);
        this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }

    initListeners() {
        window.addEventListener('resize', () => { this.resizeCanvas(); });
        
        // Eventos de Mouse/Touch para Rotação
        const startDrag = (x, y) => { this.isDragging = true; this.lastMouse = { x, y }; };
        const moveDrag = (x, y) => {
            if (!this.isDragging) return;
            const dx = x - this.lastMouse.x;
            const dy = y - this.lastMouse.y;
            this.state.rotation.x += dy * 0.01;
            this.state.rotation.y += dx * 0.01;
            this.lastMouse = { x, y };
        };
        const endDrag = () => { this.isDragging = false; };

        const container = document.getElementById('canvas-container');
        container.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
        window.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
        window.addEventListener('mouseup', endDrag);

        container.addEventListener('touchstart', e => startDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        window.addEventListener('touchmove', e => moveDrag(e.touches[0].clientX, e.touches[0].clientY), {passive: false});
        window.addEventListener('touchend', endDrag);
    }

    animate() {
        // Auto Rotação
        if (this.state.autoRotate && !this.isDragging) {
            this.state.rotation.y += 0.005;
        }

        // Limpar e Preparar Canvas
        const w = this.canvas.width / (window.devicePixelRatio || 1);
        const h = this.canvas.height / (window.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, w, h);

        // Gerar Dados da Forma Atual
        let shapeData;
        const d1 = this.state.dim1;
        const d2 = this.state.dim2;
        switch(this.state.selectedShape) {
            case 'cube': shapeData = GeometryMath.generateCube(d1); break;
            case 'prism_tri': shapeData = GeometryMath.generatePrismTriangular(d1, d2); break;
            case 'pyramid': shapeData = GeometryMath.generatePyramid(d1, d2); break;
            case 'octahedron': shapeData = GeometryMath.generateOctahedron(d1); break;
            case 'dodecahedron': shapeData = GeometryMath.generateDodecahedron(d1); break;
            case 'cylinder': shapeData = GeometryMath.generateCylinder(d1/2, d2); break;
            case 'cone': shapeData = GeometryMath.generateCone(d1/2, d2); break;
            case 'sphere': shapeData = GeometryMath.generateSphere(d1/1.5); break;
            default: shapeData = GeometryMath.generateCube(1.5);
        }

        // Projetar Vértices (3D -> 2D)
        const projected = shapeData.vertices.map(v => GeometryMath.project(v, w, h, this.state.rotation));

        // Desenhar Faces
        if (this.state.showFaces) {
            if (shapeData.type === 'round') {
                // "Fake" render para esferas/cilindros simplificados
                this.ctx.fillStyle = 'rgba(59, 130, 246, 0.05)';
                this.ctx.beginPath();
                this.ctx.arc(w/2, h/2, d1 * 30, 0, Math.PI*2);
                this.ctx.fill();
            } else if (shapeData.faces.length > 0) {
                shapeData.faces.forEach(face => {
                    this.ctx.beginPath();
                    const start = projected[face[0]];
                    this.ctx.moveTo(start.x, start.y);
                    for(let i=1; i<face.length; i++) this.ctx.lineTo(projected[face[i]].x, projected[face[i]].y);
                    this.ctx.closePath();
                    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
                    this.ctx.fill();
                });
            }
        }

        // Desenhar Arestas
        if (this.state.showEdges || shapeData.type === 'round') {
            this.ctx.beginPath();
            shapeData.edges.forEach(edge => {
                const v1 = projected[edge[0]];
                const v2 = projected[edge[1]];
                this.ctx.moveTo(v1.x, v1.y);
                this.ctx.lineTo(v2.x, v2.y);
            });
            this.ctx.strokeStyle = shapeData.type === 'round' ? (this.state.showEdges ? 'rgba(30,41,59,0.3)' : 'rgba(30,41,59,0.05)') : '#1e293b';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // Desenhar Vértices
        if (this.state.showVertices && shapeData.subtype !== 'sphere') {
            projected.forEach((v, idx) => {
                let shouldDraw = true;
                if (shapeData.type === 'round') {
                    if (shapeData.subtype === 'cone' && idx !== 0) shouldDraw = false;
                    if (shapeData.subtype === 'cylinder') shouldDraw = false;
                }
                if (shouldDraw) {
                    this.ctx.beginPath();
                    this.ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
                    this.ctx.fillStyle = '#ef4444';
                    this.ctx.fill();
                }
            });
        }

        // Desenhar Auxiliares (Apótema, etc)
        if (this.state.showAux) {
            this.ctx.save();
            this.ctx.strokeStyle = '#f59e0b';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([6, 4]);
            this.ctx.font = 'bold 16px sans-serif';
            
            const drawLabel = (p1, p2, text) => {
                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.stroke();
                const lx = (p1.x + p2.x)/2 + 10;
                const ly = (p1.y + p2.y)/2;
                this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
                this.ctx.fillRect(lx - 2, ly - 12, 14, 16);
                this.ctx.fillStyle = '#d97706';
                this.ctx.fillText(text, lx, ly);
            };

            if (this.state.selectedShape === 'pyramid') {
                const pApex = projected[4];
                const v1 = shapeData.vertices[1];
                const v2 = shapeData.vertices[2];
                const pMid = GeometryMath.project({ x: (v1.x + v2.x)/2, y: (v1.y + v2.y)/2, z: (v1.z + v2.z)/2 }, w, h, this.state.rotation);
                drawLabel(pApex, pMid, 'g');
            } else if (this.state.selectedShape === 'cone' || this.state.selectedShape === 'cylinder') {
                drawLabel(projected[0], projected[1], 'g');
            }
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Inicializar a aplicação
const app = new App();

