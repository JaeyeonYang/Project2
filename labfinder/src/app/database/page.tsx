import Link from "next/link";

const labs = [
  // Aeronautics and Astronautics Department
  {
    id: "aa-1",
    name: "Manan Arya Lab",
    school: "Stanford AA",
    keywords: "Morphing structures, Space structures, Origami structures, Flexible composites, Small satellites, Spacecraft structures, Antenna design, Folding structures, Solid mechanics, Composite materials, Deployable structures, Satellite deployment, Adaptive structures, Shape memory alloys, Lightweight structures, Space mission design, Structural optimization, Finite element analysis, Multibody dynamics, Robotics in space",
    description: "The Morphing Space Structures Lab at Stanford University is a pioneering research group dedicated to the development and implementation of innovative shape-changing structures for advanced space missions. Their research focuses on creating structures capable of transforming their configuration in response to operational needs, enabling a new generation of highly versatile and efficient spacecraft and satellite systems."
  },
  {
    id: "aa-2",
    name: "Somil Bansal Lab",
    school: "Stanford AA",
    keywords: "Autonomous Systems, Robotics, Safe Learning, Correct-by-Construction, Machine Learning, AI Safety, Control Theory, Uncertainty Quantification, Anomaly Detection, Reachability Analysis, Hamilton-Jacobi Reachability, Hybrid Systems, Nonlinear Systems, High-Dimensional Systems, Safety Verification, Neural Networks, Imitation Learning, Safe Reinforcement Learning, Air Traffic Management, Space Exploration, Autonomous Driving",
    description: "The Safe and Intelligent Autonomy Lab (SIA Lab) is dedicated to advancing the field of safe and reliable autonomous systems. Their primary focus is the development of fundamental frameworks and computational tools that guarantee the safety and performance of autonomous robots and systems operating in complex, uncertain environments."
  },
  {
    id: "aa-3",
    name: "Fu-Kuo Chang Lab",
    school: "Stanford AA",
    keywords: "Multifunctional energy storage composites (MESC), electric vehicles, structural health monitoring (SHM), intelligent structures, self-sensing diagnostics, embedded sensors, stretchable sensor networks, integrated diagnostics and prognostics, damage tolerance, failure analysis, composite materials, multi-physics computational methods, transportation vehicles, safety-critical assets, medical devices, advanced composites, sensor networks, energy storage, sensing, computing, structural mechanics, material science",
    description: "The Structures and Composites Laboratory (SACL) focuses on the development and application of advanced multifunctional materials and intelligent structures. Their research integrates sensing, computing, and energy storage technologies to create innovative solutions for transportation, safety-critical infrastructure, and medical devices."
  },
  {
    id: "aa-4",
    name: "Simone D'Amico Lab",
    school: "Stanford AA",
    keywords: "Astrodynamics, Guidance, Navigation, Control (GN&C), Distributed Space Systems (DSS), Spacecraft Formation Flying, Rendezvous and Docking, Swarm Robotics, Microsatellites, Nanosatellites, Spacecraft Autonomy, Hardware-in-the-Loop Simulation, On-Orbit Servicing, Vision-based Navigation, Cooperative Control, Environmental Characterization, Decision Making, Space Situational Awareness, Space Debris, Multi-agent Systems, Fractional Spacecraft, Space Exploration, Space Sustainability",
    description: "The Stanford Space Rendezvous Laboratory (SLAB) is a leading center for advancements in distributed space systems (DSS). Their research bridges fundamental and applied research across astrodynamics, GN&C, environmental characterization, and decision-making to address the challenges and opportunities presented by increasingly complex space missions."
  },
  {
    id: "aa-5",
    name: "Sigrid Elschot Lab",
    school: "Stanford AA",
    keywords: "Space environment, Satellite systems, Space situational awareness (SSA), Environmental remote sensing, Spacecraft, Ground-based radar, Asteroid characterization, Spacecraft anomalies, Plasma physics, Orbital mechanics, Space debris, Radiation effects, Space weather, Deep space exploration, Ocean worlds, Life detection, Remote sensing, Data visualization, Mitigation techniques, Dynamical systems, Artificial intelligence (AI) for space",
    description: "The Space Environment and Satellite Systems (SESS) laboratory is dedicated to understanding and mitigating the challenges posed by the space environment on spacecraft operations. Their research focuses on characterizing the complex interplay between spacecraft and their surroundings, employing a multidisciplinary approach that combines remote sensing, data analysis, and theoretical modeling."
  },
  {
    id: "aa-6",
    name: "Anton Ermakov Lab",
    school: "Stanford AA",
    keywords: "Solar System formation, Planetary evolution, Planetary interiors, Geophysical measurements, Isostatic gravity anomaly, Ceres, Crater Occator, AeroAstro, Geophysics, Earth and Planetary Sciences, Planetary geophysics, Remote sensing, Planetary science, Geodesy, Gravity modeling, Interior structure, Planetary differentiation, Numerical modeling, PhD admissions, Postdoctoral opportunities, Space exploration",
    description: "The lab focuses on understanding the formation and evolution of Solar System bodies, particularly focusing on constraining the internal structures of planets and other celestial objects using geophysical measurements. Their research spans across Aeronautics and Astronautics, Geophysics, and Earth and Planetary Sciences."
  },
  {
    id: "aa-7",
    name: "Grace Gao Lab",
    school: "Stanford AA",
    keywords: "Navigation, Autonomous Vehicles, Positioning, Timing, Robustness, Security, Cyber Security, Resilience, Machine Learning, Signal Processing, Formal Verification, Error Detection, Uncertainty Quantification, Unmanned Aerial Vehicles (UAVs), Autonomous Driving, Space Robotics, GNSS, Sensor Fusion, State Estimation, Path Planning, Localization",
    description: "The Navigation and Autonomous Vehicles (NAV) Lab focuses on developing robust, secure, and resilient positioning, navigation, and timing (PNT) technologies for a wide range of applications in autonomous systems. Their research directly addresses critical challenges hindering the widespread adoption of autonomous vehicles, unmanned aerial vehicles (UAVs), and space robotics."
  },
  {
    id: "aa-8",
    name: "Kentaro Hara Lab",
    school: "Stanford AA",
    keywords: "Plasma dynamics, Electric propulsion, Low-temperature plasmas, Plasma-material interactions, Plasma-wave interactions, Plasma-beam interactions, Computational fluid dynamics, Multi-fluid modeling, High-order moment closure, Magnetohydrodynamics, Particle-in-cell, Monte Carlo collisions, Direct simulation Monte Carlo, Direct kinetic simulation, Hybrid modeling, High-performance computing, Data-driven models, Extended Kalman filter, Ensemble Kalman filter, Rarefied gas dynamics, Velocity distribution functions",
    description: "The Plasma Dynamics Modeling Laboratory (PDML) is dedicated to advancing the understanding and modeling of plasma phenomena across diverse applications. Their primary focus lies in developing sophisticated numerical methods and theoretical models to unravel the complex physics governing various plasma discharges and flows."
  },
  {
    id: "aa-9",
    name: "Antony Jameson Lab",
    school: "Stanford AA",
    keywords: "Computational Fluid Dynamics (CFD), Aerodynamics, Numerical Analysis, Aircraft Design, Boeing Airplanes, Flow Simulation, flo codes, Jameson Scheme, High-Order Methods, Shock Capturing, Finite Volume Methods, Grid Generation, Mesh Refinement, Turbulence Modeling, Supersonic Flow, Transonic Flow, Hypersonic Flow, Aircraft Optimization, Design Optimization, Multigrid Methods, High-Performance Computing",
    description: "The lab is heavily focused on computational fluid dynamics (CFD) and its application to aircraft design. Their research involves the development and application of advanced numerical methods for simulating complex fluid flows, primarily focused on the aerodynamic performance of aircraft."
  },
  {
    id: "aa-10",
    name: "Mykel Kochenderfer Lab",
    school: "Stanford AA",
    keywords: "Decision Making under Uncertainty, Optimal Decision Strategies, Probabilistic Reasoning, High-Dimensional Systems, Air Traffic Control, Unmanned Aircraft Systems (UAS), Automated Driving, Robust Control, Airspace Modeling, Aircraft Collision Avoidance, AI Safety, Reinforcement Learning, Computational Methods, Optimization Algorithms, Algorithm Validation, Probabilistic Model Checking, Formal Methods, Human-Centered AI, Intelligent Systems, Autonomous Systems",
    description: "The Stanford Intelligent Systems Laboratory (SISL) focuses on the development of advanced algorithms and analytical methods for robust decision-making systems operating in complex, uncertain environments. Their research significantly contributes to the advancement of artificial intelligence (AI) and its applications in critical domains."
  },
  {
    id: "aa-11",
    name: "Maria Sakovsky Lab",
    school: "Stanford AA",
    keywords: "Spacecraft structures, Reconfigurable structures, Active structures, Shape-shifting antennas, Crawling robots, Sun-tracking solar arrays, Bistable structures, Composite materials, Smart materials, Solid mechanics, Multi-disciplinary engineering, Electromagnetic performance, Optical performance, Space exploration, Robotics, AIAA Scitech, Nature Communications, Adaptive structures, Material science, Structural mechanics, Aerospace engineering",
    description: "The Reconfigurable and Active Structures (ReAct) Lab is at the forefront of developing innovative spacecraft structures capable of adapting to diverse and challenging environments. Their research focuses on creating structures that can dynamically alter their physical properties in response to external stimuli or environmental changes."
  },
  {
    id: "aa-12",
    name: "Mac Schwager Lab",
    school: "Stanford AA",
    keywords: "Multi-robot systems, robot collaboration, human-robot interaction, swarm robotics, distributed control, cooperative control, motion planning, task allocation, perception, sensor fusion, computer vision, machine learning, reinforcement learning, deep learning, robotics, autonomous robots, path planning, multi-agent systems, robot navigation, safety verification",
    description: "The Multi-Robot Systems (MRS) Lab focuses on endowing groups of robots with the intelligence necessary for safe and effective collaboration, both among themselves and with human partners. Their research significantly contributes to the advancement of multi-robot systems, a rapidly growing field with broad implications across various industries and applications."
  },
  {
    id: "aa-13",
    name: "Debbie Senesky Lab",
    school: "Stanford AA",
    keywords: "Microgravity materials science, Space-based manufacturing, Semiconductor crystal growth, Gallium nitride, Silicon carbide, Graphene aerogel, Metal-organic frameworks, Extreme environment electronics, Venus exploration, High-temperature electronics, Radiation-hardened electronics, Nanomaterials fabrication, Microgravity fluid dynamics, Thermal convection, Buoyancy effects, International Space Station (ISS) research, SUBSA furnace, Solidification processes, Defect reduction, Material synthesis",
    description: "The EXtreme Environment Microsystems Laboratory (XLab) is focused on the development and fabrication of advanced materials and electronic devices capable of operating in extreme environments, particularly those encountered in space exploration. Their research spans materials science, microgravity fluid dynamics, and space-based manufacturing."
  },
  {
    id: "aa-14",
    name: "Todd Walter Lab",
    school: "Stanford AA",
    keywords: "GPS, GNSS, Satellite Based Augmentation Systems (SBAS), Advanced Autonomous Integrity Monitoring (ARAIM), High-Precision GNSS, Autonomous Vehicles, Cyber Security, Navigation, Position, Navigation, and Timing (PNT), Integrity Monitoring, Differential GPS, Real-Time Kinematic (RTK), Precise Point Positioning (PPP), Multi-GNSS, Signal Processing, Error Mitigation, Atmospheric Modeling, Spoofing Detection, Jamming Detection, Resilient Navigation, Space-Based Augmentation Systems",
    description: "The GPS Research Lab is focused on advancing the capabilities and security of Global Navigation Satellite Systems (GNSS), primarily GPS. Their research significantly contributes to the development and deployment of enhanced and more resilient navigation technologies for diverse applications."
  },

  // Computer Science Department
  {
    id: "cs-1",
    name: "Sara Achour Lab",
    school: "Stanford CS",
    keywords: "Analog computing, Programming languages, Compilers, Runtime systems, Non-traditional hardware, Emerging computing platforms",
    description: "The research lab led by Assistant Professor Sara Achour at Stanford University focuses on bridging the gap between the ease of use desired by end-users and the complex intricacies of emerging analog computing platforms."
  },
  {
    id: "cs-2",
    name: "Nima Anari Lab",
    school: "Stanford CS",
    keywords: "Algorithms, Probability, Combinatorics, Theoretical Computer Science, Algorithm Design, Randomized Algorithms",
    description: "The lab focuses on theoretical computer science, particularly the interplay of algorithms, probability, and combinatorics."
  },
  {
    id: "cs-3",
    name: "Zain Asgar Lab",
    school: "Stanford CS",
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Human-Computer Interaction, Robotics",
    description: "The lab is deeply involved in diverse aspects of artificial intelligence (AI) research and its societal implications."
  },
  {
    id: "cs-4",
    name: "Peter Bailis Lab",
    school: "Stanford CS",
    keywords: "Artificial Intelligence, AI Index, AI Governance, AI Ethics, Machine Learning, Deep Learning",
    description: "The lab focuses on artificial intelligence research and its societal implications, with a strong emphasis on both technological advancement and ethical considerations."
  },
  {
    id: "cs-5",
    name: "Clark Barrett Lab",
    school: "Stanford CS",
    keywords: "Automated Reasoning, AI, Centaur, Theorem Proving, Satisfiability Modulo Theories (SMT), Constraint Satisfaction",
    description: "The Center for Automated Reasoning (CAR) at Stanford University is a leading research hub dedicated to advancing the frontiers of automated reasoning and its applications in artificial intelligence."
  },

  // Electrical Engineering Department
  {
    id: "ee-1",
    name: "Amin Arbabian Lab",
    school: "Stanford EE",
    keywords: "Optics, Electronics, Valleytronics, Quantum Sensing, Energy Efficiency, Grid Reliability, Renewable Energy, Net Zero Transition, Climate Change, Global Environmental Policy",
    description: "The lab focuses on applied physics, energy, and related policy areas, with research spanning from optics and electronics to energy efficiency and environmental sustainability."
  },
  {
    id: "ee-2",
    name: "Lambertus Hesselink Lab",
    school: "Stanford EE",
    keywords: "Nanophotonics, Nanostructures, Diffraction Limit, Particle Trapping, Enhanced Photodetector, VCSELs, Data Storage, Lab-on-a-Chip, Microfluidics",
    description: "The Hesselink Research Group explores fundamental light-matter interactions and translates these discoveries into novel applications across diverse fields, including nanotechnology, bio-engineering, and information technology."
  },
  {
    id: "ee-3",
    name: "Siddharth Krishnan Lab",
    school: "Stanford EE",
    keywords: "Optics, Electronics, Valleytronics, Quantum Sensing, Energy Efficiency, Grid Reliability, Renewable Energy, Net-Zero Transition, Energy Transition",
    description: "The lab conducts interdisciplinary research focusing on applied physics, energy, and environmental policy, with significant crossovers into statistics, international security, and quantum technologies."
  },
  {
    id: "ee-4",
    name: "Subhasish Mitra Lab",
    school: "Stanford EE",
    keywords: "Robust systems, digital systems, NanoSystems, brain-computer interfaces, BCI, neuromorphic computing, hardware security, fault tolerance, embedded systems",
    description: "The Robust Systems Group (RSG) is dedicated to advancing the frontiers of digital systems with a strong focus on robust operation, NanoSystems, and brain-computer interfaces (BCIs)."
  },

  // Mechanical Engineering Department
  {
    id: "me-1",
    name: "Adam Boies Lab",
    school: "Stanford ME",
    keywords: "Aerosols, Nanotechnology, Energy Storage, Sustainable Nanocarbons, Self-Assembled Materials, Nanoparticles, Pollution, Air Quality, Catalysis",
    description: "The Aerosol and Nanotechnology for Energy and the Environment (ANEE) group focuses on developing innovative energy and environmental technologies leveraging the unique properties of aerosols and nanomaterials."
  },
  {
    id: "me-2",
    name: "Steven Hartley Collins Lab",
    school: "Stanford ME",
    keywords: "Biomechatronics, Wearable robots, Exoskeletons, Prostheses, Human-in-the-loop optimization, Gait analysis, Ankle push-off, Arm swinging, Energy economy",
    description: "The Biomechatronics Laboratory designs and develops robotic systems to enhance human mobility, particularly focusing on individuals with disabilities."
  },
  {
    id: "me-3",
    name: "Mark Cutkosky Lab",
    school: "Stanford ME",
    keywords: "Bioinspired Robotics, Tadpole Robotics, Gecko Adhesives, Dry Adhesives, Vertical Climbing Robots, Underwater Robotics, Tactile Sensing, Multi-limbed Robotics",
    description: "The Bio-inspired Dynamic Manipulation Lab (BDML) pushes the boundaries of robotics, particularly in the areas of bio-inspired design, advanced manipulation, and medical applications."
  },
  {
    id: "me-4",
    name: "Eric Darve Lab",
    school: "Stanford ME",
    keywords: "Molecular Dynamics, Multiscale Modeling, Stochastic Methods, Accelerated Molecular Dynamics, Coarse-Grained Modeling, Numerical Analysis, High-Performance Computing",
    description: "The lab focuses on the development and application of advanced computational methods to solve complex problems in various scientific and engineering domains."
  },

  // Materials Science and Engineering Department
  {
    id: "mse-1",
    name: "Alberto Salleo Lab",
    school: "Stanford MSE",
    keywords: "Organic semiconductors, charge transport, mixed ionic-electronic conductors, structure-property relationships, biosensors, electrocatalysis, neuromorphic computation",
    description: "The Salleo Research Group advances the fundamental understanding and technological application of organic semiconducting materials."
  },
  {
    id: "mse-2",
    name: "Sarah Heilshorn Lab",
    school: "Stanford MSE",
    keywords: "Biomaterials, Regenerative Medicine, Tissue Engineering, Protein Engineering, Biomimetic Materials, 3D Bioprinting, Human Organoids",
    description: "The Heilshorn Biomaterials Group focuses on the design and development of novel biomaterials for applications in regenerative medicine and tissue engineering."
  },
  {
    id: "mse-3",
    name: "William Chueh Lab",
    school: "Stanford MSE",
    keywords: "Lithium-ion batteries, Sodium-ion batteries, Battery lifetime, Electrode utilization, Energy storage, Energy conversion, Redox reactions, Materials chemistry",
    description: "The Chueh Group advances energy storage and conversion technologies through fundamental materials science and chemistry research."
  },
  {
    id: "mse-4",
    name: "Yi Cui Lab",
    school: "Stanford MSE",
    keywords: "Battery technology, Green energy, Next-generation batteries, Energy storage, Renewable energy, Material science, Nanomaterials, Electrochemistry",
    description: "The Cui lab focuses on next-generation battery technologies and sustainable energy solutions, with significant contributions to energy research and material science."
  },

  // Management Science and Engineering Department
  {
    id: "msande-1",
    name: "Jose H. Blanchet Lab",
    school: "Stanford MS&E",
    keywords: "Stochastic Optimization, Robust Optimization, Monte Carlo Methods, Applied Probability, Stochastic Simulation, Distributionally Robust Stochastic Control, Markov Chains, Convergence Rates, Spatial Branching Processes, Polymeric Networks, Shortest Paths, Optimal Transport, Risk Analysis",
    description: "The Blanchet Lab focuses on the development and application of advanced probabilistic and statistical methods to solve complex problems across diverse fields, with expertise in applied probability, Monte Carlo methods, and stochastic optimization."
  },
  {
    id: "msande-2",
    name: "Thomas Byers Lab",
    school: "Stanford MS&E",
    keywords: "Entrepreneurship, Startup Performance, Technology Innovation, Entrepreneurial Policy, Ethics in Entrepreneurship, Climate and Sustainability Entrepreneurship, Inclusive Entrepreneurship, International Entrepreneurship, Lean Startup Methodology",
    description: "The Stanford Technology Ventures Program (STVP) is a leading research and educational initiative focused on fostering a new generation of responsible and impactful entrepreneurs."
  },
  {
    id: "msande-3",
    name: "Kathleen Eisenhardt Lab",
    school: "Stanford MS&E",
    keywords: "Entrepreneurship, Startup Performance, Technology Innovation, Entrepreneurial Policy, Ethics in Entrepreneurship, Climate and Sustainability Entrepreneurship, Inclusive Entrepreneurship, International Entrepreneurship, Lean Startup Methodology",
    description: "The lab focuses on fostering responsible and impactful entrepreneurship globally, with research delving into the multifaceted aspects of startup creation, growth, and societal impact."
  },
  {
    id: "msande-4",
    name: "Kay Giesecke Lab",
    school: "Stanford MS&E",
    keywords: "Stochastic Models, Statistical Machine Learning, Computational Algorithms, Risk Management, Market Surveillance, Fair Lending, Sustainable Investing, Financial Regulation, AI in Fintech, Fixed-income Markets",
    description: "The Advanced Financial Technologies Laboratory (AFTL) focuses on the intersection of advanced technologies, particularly artificial intelligence (AI) and machine learning, and the complexities of financial systems."
  },

  // Institute for Computational and Mathematical Engineering
  {
    id: "icme-1",
    name: "Charbel Farhat Lab",
    school: "Stanford ICME",
    keywords: "Nanomaterials, Catalysis, Surface Science, Spectroscopy, Nanotechnology, Energy Storage, Electrochemistry, Material Science, Synthetic Chemistry, Inorganic Chemistry, Physical Chemistry",
    description: "The Farhat Research Group is dedicated to advancing the frontiers of nanomaterials and catalysis, integrating principles of chemistry, physics, and materials science to design, synthesize, and characterize novel nanomaterials."
  },
  {
    id: "icme-2",
    name: "Antony Jameson Lab",
    school: "Stanford ICME",
    keywords: "Computational Fluid Dynamics (CFD), Aerodynamics, Numerical Analysis, Aircraft Design, Flow Simulation, High-Order Methods, Mesh Generation, Shock-Capturing Schemes, Turbulence Modeling",
    description: "The lab focuses on the development and application of advanced numerical methods for solving complex fluid flow problems, primarily within the context of aeronautical engineering."
  },
  {
    id: "icme-3",
    name: "Julia Salzman Lab",
    school: "Stanford ICME",
    keywords: "Statistical Inference, Genomics, Metagenomics, Microbiology, Viral Genomics, Microbial Genomics, Eukaryotic Genomics, DNA Sequencing, RNA Sequencing, SPLASH Algorithm",
    description: "The Salzman Lab focuses on developing and applying novel statistical algorithms for biological inference, primarily within the field of genomics."
  },
  {
    id: "icme-4",
    name: "Andrew Spakowitz Lab",
    school: "Stanford ICME",
    keywords: "Biological Processes, Soft Materials, Theoretical Physics, Computational Physics, Molecular Dynamics, Monte Carlo Simulations, Statistical Mechanics, Polymer Physics, Biophysics",
    description: "The Spakowitz Research Group focuses on the theoretical and computational investigation of biological processes and soft materials, bridging the gap between fundamental physical principles and complex biological phenomena."
  },

  // Bioengineering Department
  {
    id: "bioe-1",
    name: "Markus Covert Lab",
    school: "Stanford BioE",
    keywords: "Systems biology, whole-cell modeling, live-cell microscopy, immune signaling, host-pathogen interactions, innate immune system, kinase reporter, deep learning, image analysis, gene expression, genomics, transcriptomics, cell behavior, bioengineering, mathematical modeling, computational biology, live-cell imaging, single-cell analysis, high-throughput screening, cellular dynamics",
    description: "Pioneering research in systems biology through whole-cell modeling and live-cell microscopy, focusing on host-pathogen interactions and immune system mechanisms."
  },
  {
    id: "bioe-2",
    name: "Russ B. Altman Lab",
    school: "Stanford BioE",
    keywords: "Computational Biology, Bioinformatics, Machine Learning, Biomedical Informatics, Genomics, Proteomics, Metabolomics, Systems Biology, Drug Discovery, Precision Medicine, Health Informatics, Clinical Informatics, Big Data Analytics, Artificial Intelligence, Natural Language Processing (NLP), Electronic Health Records (EHR), Data Mining, Algorithm Development, Network Biology, Omics Integration",
    description: "Developing computational methods and tools to analyze biological datasets and uncover fundamental principles in biology and medicine."
  },
  {
    id: "bioe-3",
    name: "Kwabena Boahen Lab",
    school: "Stanford BioE",
    keywords: "Neuromorphic computing, Brain emulation, Reverse engineering, Neural design principles, Deep learning efficiency, Sustainable AI, Scalable computation, Low-power computing, Neurobiology, Electrical engineering, Computer science, Artificial intelligence, Machine learning, Cognitive architectures, Brain-inspired AI, Efficient learning algorithms, Data efficiency, Neuroscience, Spiking neural networks, Energy-efficient AI",
    description: "Reverse-engineering brain computation principles to create sustainable and efficient artificial intelligence systems."
  },
  {
    id: "bioe-4",
    name: "Jennifer R. Cochran Lab",
    school: "Stanford BioE",
    keywords: "protein engineering, peptide ligands, combinatorial chemistry, rational design, biophysics, wound healing, cardiac tissue engineering, cancer therapy, cancer imaging, biological systems, designer proteins, biomedical applications, interdisciplinary research, molecular engineering, drug delivery, therapeutic proteins, protein-protein interactions, biomaterials, tissue regeneration, in vivo imaging",
    description: "Designing and applying novel proteins and peptides for diverse biomedical applications through interdisciplinary approaches."
  },
  {
    id: "bioe-5",
    name: "Karl Deisseroth Lab",
    school: "Stanford BioE",
    keywords: "Optogenetics, CLARITY, Neuropixels, Connectomics, Brain-Computer Interfaces, Neurotechnology, Neural Circuits, Depression, Anxiety, Addiction, Neuropsychiatric Disorders, Cellular Imaging, Microscopy, Viral Vectors, Transgenic Mice, Systems Neuroscience, Computational Neuroscience, Behavioral Neuroscience, Neural Engineering, Neuroprosthetics",
    description: "Pioneering research in neuroscience and neurotechnology, integrating biology, engineering, chemistry, and computation."
  },
  {
    id: "bioe-6",
    name: "KC Huang Lab",
    school: "Stanford BioE",
    keywords: "HTML, captioning, accessibility, web accessibility, semantic web, user experience (UX), user interface (UI), web development, external stylesheets, CSS, web standards, ARIA attributes, WCAG, assistive technologies, inclusive design, digital accessibility, information architecture, human-computer interaction (HCI), web content accessibility guidelines, web semantics",
    description: "Enhancing web accessibility through optimized HTML and CSS techniques for improved user experience."
  },
  {
    id: "bioe-7",
    name: "Joshua Makower Lab",
    school: "Stanford BioE",
    keywords: "Biodesign, Medical Innovation, Healthcare Technology, Entrepreneurial Resilience, Physical Medicine and Rehabilitation, Pain Medicine, Substance Abuse, AI in Healthcare, Community Health, Health Technology Entrepreneurship, Innovation Fellowship, Neuroscience, Biomedical Engineering, Computer Science, Business, Health Economics, Patient Care, MacArthur Grant, Unmet Medical Needs, Health and Well-being, Resilience",
    description: "Translating scientific discoveries into healthcare solutions through innovative biodesign methodologies."
  },
  {
    id: "bioe-8",
    name: "Alison Marsden Lab",
    school: "Stanford BioE",
    keywords: "Cardiovascular disease, Computational fluid dynamics (CFD), Patient-specific modeling, Pediatric heart disease, Congenital heart disease, Adult cardiovascular disease, Finite element analysis (FEA), Medical device design, Surgical planning, SimVascular, Open-source software, Bioprinting, Cardiovascular biomechanics, Computational modeling, Image-based modeling, Heart surgery, Hemodynamics, Blood flow simulation, Computational anatomy, Mesh generation, DataWorks! Challenge",
    description: "Advancing cardiovascular disease treatment through innovative computational methods and patient-specific modeling."
  },
  {
    id: "bioe-9",
    name: "James Swartz Lab",
    school: "Stanford BioE",
    keywords: "Protein nanoparticles, Enzymatic systems, Cell-free protein synthesis, Targeted drug delivery, Nanomedicine, Vaccine development, Liquid biopsy, Circulating tumor cells, CO2 utilization, Carbon-negative chemistry, Bio-based hydrogen production, Biotechnology, Synthetic biology, Metabolic engineering, Sustainable biomanufacturing, Photosynthesis, Renewable energy, Immunotherapy, Gene therapy, Precision medicine",
    description: "Developing innovative biotechnologies to address critical challenges in human and planetary health."
  },
  {
    id: "bioe-10",
    name: "Annelise E. Barron Lab",
    school: "Stanford BioE",
    keywords: "Antimicrobial peptides, LL-37, Host defense peptides, Biomimicry, Peptoids, Alzheimer's disease, Neurological infections, Antibiotic resistance, Lung surfactant proteins, Pneumonia, COVID-19, Innate immunity, Polymicrobial infections, Biophysics, Therapeutic development, Drug delivery, Viral infections, Bacterial infections, Fungal infections, Co-infections, Minority health disparities",
    description: "Studying and engineering host defense peptides to enhance the body's natural defense mechanisms."
  },
  {
    id: "bioe-11",
    name: "Zev Bryant Lab",
    school: "Stanford BioE",
    keywords: "Molecular motors, DNA replication, cell migration, nanoscale machines, single-molecule biophysics, motor protein, kinesin, dynein, myosin, ATP hydrolysis, microtubules, actin filaments, force generation, microscopy, optical tweezers, single-molecule manipulation, protein engineering, biomechanics, molecular mechanism, in vitro motility assays, structural biology, protein dynamics, cellular transport",
    description: "Investigating molecular motors and their role in essential biological processes through advanced biophysical techniques."
  },
  {
    id: "bioe-12",
    name: "David Camarillo Lab",
    school: "Stanford BioE",
    keywords: "Smart medical devices, human motion analysis, Covid-19, ventilator design, single-use ventilator, biomechanics, concussion, brain trauma, instrumented mouthguards, computational modeling, neuroimaging, diagnostic technology, preventative technology, soft surgical robots, motion controllers, deep learning, surgical robotics, reproductive biomechanics, embryo viability, IVF, multiple gestations",
    description: "Developing innovative technologies for critical care medicine, sports injury prevention, and minimally invasive surgery."
  },
  {
    id: "bioe-13",
    name: "Drew Endy Lab",
    school: "Stanford BioE",
    keywords: "Artificial Intelligence, Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, Robotics, Data Mining, Big Data Analytics, Algorithm Design, Software Engineering, Cybersecurity, Quantum Computing, Bioinformatics, Neuroscience, Cognitive Science, Human-Computer Interaction, High-Performance Computing, Cloud Computing, Data Structures, Optimization Algorithms",
    description: "Advancing computer science through interdisciplinary collaboration and innovative research."
  },
  {
    id: "bioe-14",
    name: "Polly Fordyce Lab",
    school: "Stanford BioE",
    keywords: "Bioengineering, Synthetic Biology, Parasitology, Malaria, Red Blood Cell Engineering, Host-Parasite Interactions, Protein-Membrane Interactions, Cellular Communication, Biomedical Applications, Drug Delivery, Bottom-up Synthetic Biology, Minimal Cell Systems, Cell Division, Bacterial Mechanisms, Viral Mechanisms, Infectious Disease, Biomedical Engineering, Systems Biology, Genetic Engineering, Cellular Engineering",
    description: "Understanding parasite-host interactions through bottom-up synthetic biology approaches."
  },
  {
    id: "bioe-15",
    name: "Michael Lin Lab",
    school: "Stanford BioE",
    keywords: "Voltage indicators, Genetically encoded indicators, Synaptic transmission, Dendritic voltage propagation, ASAP5, Luciferase reporters, Biochemical activity, Single-chain proteins, Optical control, Chemical control, Protein engineering, Viral protease inhibitors, Small molecule inhibitors, Neurobiology, Bioengineering, Molecular design, In vivo imaging, Membrane potential, Neuronal activity, Single vesicle transmission, Chemogenetics",
    description: "Developing tools to image and manipulate biological processes in neuroscience and bioengineering."
  },
  {
    id: "bioe-16",
    name: "Jan Liphardt Lab",
    school: "Stanford BioE",
    keywords: "Single-molecule biophysics, optical microscopy, time-series analysis, regulatory principles, non-equilibrium statistical mechanics, machine learning, polymer physics, convolutional neural networks, DeepEvolve, genome-wide gene expression, DNA looping, chromatin compaction, transcriptional regulation, genome editing, Secure Multiparty Computation (SMC), Fully Homomorphic Encryption (FHE), privacy-preserving analytics, digital health, public health, biomedical applications, health AI, data analysis",
    description: "Investigating fundamental principles of single molecules in living cells through physics, engineering, and biology."
  },
  {
    id: "bioe-17",
    name: "Emma Lundberg Lab",
    school: "Stanford BioE",
    keywords: "Proteomics, Cell Biology, Human Protein Atlas, Spatiotemporal Proteomics, Microscopy, Image Analysis, Artificial Intelligence, Protein-Protein Interactions, Cellular Function, Disease Mechanisms, Systems Biology, Bioengineering, Cell Atlas, Open Science, Science Communication, Computational Biology, Data Integration, Cellular Models, Quantitative Biology, Clinical Decision-Making",
    description: "Advancing cell biology and proteomics research through advanced imaging and analysis techniques."
  },
  {
    id: "bioe-18",
    name: "Lei (Stanley) Qi Lab",
    school: "Stanford BioE",
    keywords: "Genome engineering, Synthetic biology, Epigenetic gene therapy, CRISPR-Cas9, CRISPRi, CRISPRa, LiveFISH, CRISPR-GO, CasMINI, hyperCas12a, Mammalian genome, Epigenome, Gene activation, Gene repression, 3D genome organization, T cell engineering, Stem cell engineering, Noncoding elements, Influenza treatment, SARS-CoV-2 treatment, Neurodegenerative diseases",
    description: "Developing innovative genome engineering and synthetic biology technologies for disease treatment."
  },
  {
    id: "bioe-19",
    name: "Lacramioara Bintu Lab",
    school: "Stanford BioE",
    keywords: "gene regulation, mammalian cells, chromatin, chromatin structure, chromatin memory, oncohistones, transcription factors, high-throughput screening, single-cell imaging, mathematical modeling, synthetic biology, RNA, RNA-binding proteins (RBPs), effector domains, high-throughput (HT) methods, gene expression, transcriptional regulation, activators, repressors, chromatin spreading, perturbation assays",
    description: "Understanding gene regulation in mammalian cells through synthetic biology and advanced imaging techniques."
  },
  {
    id: "bioe-20",
    name: "Jenn Brophy Lab",
    school: "Stanford BioE",
    keywords: "Genetic engineering, Plant engineering, Microbial engineering, Synthetic biology, Sustainable agriculture, Environmental stress resilience, Plant-microbe interactions, Genome editing, CRISPR-Cas systems, Metabolic engineering, Plant biotechnology, Stress tolerance, Drought resistance, Salt tolerance, Disease resistance, Bioremediation, Agricultural sustainability, Precision agriculture, Phytoremediation, Transgenic plants, Microbial consortia",
    description: "Developing sustainable agricultural systems through genetic engineering and synthetic biology."
  },
  {
    id: "bioe-21",
    name: "Matthias Garten Lab",
    school: "Stanford BioE",
    keywords: "Bioengineering, Synthetic Biology, Parasitology, Malaria, Red Blood Cell Engineering, Host-Parasite Interactions, Protein-Membrane Interactions, Cellular Communication, Biomedical Applications, Drug Delivery, Bottom-up Synthetic Biology, Minimal Cell Systems, Cell Division, Bacterial Mechanisms, Viral Mechanisms, Infectious Disease, Biomedical Engineering, Systems Biology, Genetic Engineering, Cellular Engineering",
    description: "Investigating parasite-host interactions through synthetic biology approaches."
  },
  {
    id: "bioe-22",
    name: "Rogelio Hernández-López Lab",
    school: "Stanford BioE",
    keywords: "Systems biology, Synthetic biology, Cellular engineering, Cancer immunotherapy, Cell therapies, Bioengineering, Mechanistic biology, Cellular recognition, Cellular communication, Multicellular systems, Biomedical engineering, Molecular circuits, Tissue engineering, Genetic engineering, Cell signaling, Systems immunology, Synthetic circuits, Biomolecular engineering, Programmable cells, Next-generation biotechnology",
    description: "Reprogramming molecular circuits for next-generation biotechnology applications."
  },
  {
    id: "bioe-23",
    name: "Possu Huang Lab",
    school: "Stanford BioE",
    keywords: "protein design, generative models, protein structure prediction, deep learning, all-atom protein modeling, protein sequence design, bioinformatics, machine learning, immunoglobulin proteins, TRACER algorithm, Sculptor algorithm, Protpardelle, bioRxiv, Nature Biotechnology, Nature Communications, PNAS, NeurIPS, ICLR, protein engineering, structural biology",
    description: "Advancing protein design through computational methods and machine learning."
  },
  {
    id: "bioe-24",
    name: "Paul Nuyujukian Lab",
    school: "Stanford BioE",
    keywords: "Brain-computer interface, Neural prosthetics, Neuroengineering, Bioengineering, Neurosurgery, Neural decoding, Neural encoding, Closed-loop brain stimulation, Implantable devices, Microstimulation, Electrophysiology, Neuroplasticity, Motor control, Sensory feedback, Machine learning, Artificial intelligence, Signal processing, Human-computer interaction, Neuroprosthetics translational research, Clinical translation",
    description: "Developing brain-computer interfaces and neural prosthetics for clinical applications."
  },
  {
    id: "bioe-25",
    name: "Hawa Racine Thiam Lab",
    school: "Stanford BioE",
    keywords: "Innate immunity, Cellular biophysics, Immune cell mechanics, Cell migration, Cell deformation, High-resolution microscopy, Quantitative cell biology, Biophysics, Immunology, Modeling, Host-defense, Pathogen neutralization, Cell-scale forces, Force sensing, Force generation, Force transmission, Experimental biophysics, Genetics, Immune cell re-engineering, Tissue mechanics",
    description: "Studying cellular biophysics of innate immunity and immune cell mechanics."
  },
  {
    id: "bioe-26",
    name: "Bo Wang Lab",
    school: "Stanford BioE",
    keywords: "Collective cell behavior, Tissue regeneration, Bioengineering, Organismal biology, Statistical physics, Quantitative imaging, Functional genomics, Physical modeling, Neural activity reporters, Protein engineering, RNA biochemistry, Animal development, Expansion spatial transcriptomics, Photosymbiosis, Acoel regeneration, Deer antler regeneration, Bone repair, Systemic regeneration responses, Neural circuit discovery, Gene regulation, Developmental biology",
    description: "Investigating collective cell behavior and tissue regeneration through interdisciplinary approaches."
  }
];

export default function Database() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#f8f9fa] text-[#1a2233]">
      <main className="flex flex-col items-center gap-8 p-8 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-2">연구실 데이터베이스</h2>
        
        {/* 검색 및 필터 섹션 */}
        <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="연구실 이름, 키워드로 검색..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a2233]"
          />
          <select className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1a2233]">
            <option value="">모든 학과</option>
            <option value="AA">Aeronautics and Astronautics</option>
            <option value="CS">Computer Science</option>
            <option value="EE">Electrical Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="MSE">Materials Science & Engineering</option>
            <option value="MS&E">Management Science & Engineering</option>
            <option value="ICME">Institute for Computational & Mathematical Engineering</option>
          </select>
        </div>

        {/* 연구실 목록 */}
        <div className="grid gap-6 w-full">
          {labs.map((lab) => (
            <div key={lab.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-1">{lab.name}</h3>
                  <div className="text-[#666] mb-2">{lab.school}</div>
                  <div className="text-sm text-[#666] mb-2">
                    <strong>주요 연구 키워드:</strong> {lab.keywords}
                  </div>
                  <details className="text-sm text-[#666]">
                    <summary className="cursor-pointer hover:text-[#1a2233]">연구실 소개 보기</summary>
                    <p className="mt-2">{lab.description}</p>
                  </details>
                </div>
                <Link href={`/lab/${lab.id}`} className="text-[#1a2233] underline whitespace-nowrap">
                  상세 정보 보기
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex gap-2 mt-8">
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">이전</button>
          <button className="px-4 py-2 rounded-lg bg-[#1a2233] text-white">1</button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">2</button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">3</button>
          <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">다음</button>
        </div>
      </main>
    </div>
  );
} 