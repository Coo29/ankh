// Scene setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Uniforms for the shader
        const uniforms = {
            u_time: { value: 0.0 },
            u_polar_coordinates: { value: false },
            u_polar_center: { value: new THREE.Vector2(0.5, 0.5) },
            u_polar_zoom: { value: 1.0 },
            u_polar_repeat: { value: 1.0 },
            u_spin_rotation: { value: 1.0 },
            u_spin_speed: { value: 1.0 },
            u_offset: { value: new THREE.Vector2(0.0, 0.0) },
            u_colour_1: { value: new THREE.Vector4(0.05, 0.13, 0.25, 1.0) }, // Color 1
            u_colour_2: { value: new THREE.Vector4(0.78, 0.70, 0.29, 1.0) }, // Color 2
            u_colour_3: { value: new THREE.Vector4(0.31, 0.34, 0.47, 1.0) }, // Color 3
            u_contrast: { value: 2.0 },
            u_spin_amount: { value: 0.36 },
            u_pixel_filter: { value: 700.0 },
            u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        };

        // Vertex Shader (passes positions directly)
        const vertexShader = `
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        // Fragment Shader (your Godot shader converted)
        const fragmentShader = `
            precision mediump float;

            uniform bool u_polar_coordinates;
            uniform vec2 u_polar_center;
            uniform float u_polar_zoom;
            uniform float u_polar_repeat;

            uniform float u_spin_rotation;
            uniform float u_spin_speed;
            uniform vec2 u_offset;
            uniform vec4 u_colour_1;
            uniform vec4 u_colour_2;
            uniform vec4 u_colour_3;
            uniform float u_contrast;
            uniform float u_spin_amount;
            uniform float u_pixel_filter;
            uniform float u_time;
            uniform vec2 u_resolution;

            #define SPIN_EASE 1.0

            vec2 polar_coords(vec2 uv, vec2 center, float zoom, float repeat) {
                vec2 dir = uv - center;
                float radius = length(dir) * 2.0;
                float angle = atan(dir.y, dir.x) * (1.0 / (3.141592653589793 * 2.0));
                return mod(vec2(radius * zoom, angle * repeat), 1.0);
            }

            vec4 effect(vec2 screenSize, vec2 screen_coords) {
                float pixel_size = length(screenSize) / u_pixel_filter;
                vec2 uv = (floor(screen_coords * (1.0 / pixel_size)) * pixel_size - 0.5 * screenSize) / length(screenSize) - u_offset;
                float uv_len = length(uv);

                float speed = (u_spin_rotation * SPIN_EASE * 0.2) + 302.2;
                float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE * 20.0 * (u_spin_amount * uv_len + (1.0 - u_spin_amount));
                vec2 mid = (screenSize / length(screenSize)) / 2.0;
                uv = vec2(uv_len * cos(new_pixel_angle) + mid.x, uv_len * sin(new_pixel_angle) + mid.y) - mid;

                uv *= 30.0;
                speed = u_time * (u_spin_speed);
                vec2 uv2 = vec2(uv.x + uv.y);

                for (int i = 0; i < 5; i++) {
                    uv2 += sin(max(uv.x, uv.y)) + uv;
                    uv += 0.5 * vec2(cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121), sin(uv2.x - 0.113 * speed));
                    uv -= cos(uv.x + uv.y) - sin(uv.x * 0.711 - uv.y);
                }

                float contrast_mod = (0.25 * u_contrast + 0.5 * u_spin_amount + 1.2);
                float paint_res = min(2.0, max(0.0, length(uv) * 0.035 * contrast_mod));
                float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
                float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
                float c3p = 1.0 - min(1.0, c1p + c2p);

                vec4 ret_col = (0.3 / u_contrast) * u_colour_1 + (1.0 - 0.3 / u_contrast) * (u_colour_1 * c1p + u_colour_2 * c2p + vec4(c3p * u_colour_3.rgb, c3p * u_colour_1.a));
                return ret_col;
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                if (u_polar_coordinates) {
                    uv = polar_coords(uv, u_polar_center, u_polar_zoom, u_polar_repeat);
                }
                gl_FragColor = effect(u_resolution, uv * u_resolution);
            }
        `;

        // Shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        // Fullscreen plane
        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, shaderMaterial);
        scene.add(plane);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            uniforms.u_time.value += 0.01; // Increment time
            renderer.render(scene, camera);
        }

        animate();

        // Resize handling
        window.addEventListener("resize", () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        });

        const container = document.getElementById("bg-canvas");
        container.appendChild(renderer.domElement);