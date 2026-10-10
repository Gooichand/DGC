// Projects Data with Collaboration Flags
const projectsData = [
    {
        id: "EV1D0",
        title: "EVID-DGC – Blockchain Evidence Management System",
        description: "Production-ready digital evidence management platform with 8-role RBAC, dual authentication (MetaMask + email), and full blockchain anchoring on Polygon. Evidence stored decentralized via IPFS (Pinata), every action immutably logged. Phase 1 & 2 complete. Phase 3 adding AI-powered deepfake detection, metadata forensics, and legal compliance tools.",
        category: "BLOCKCHAIN",
        tech: ["Node.js", "Express", "Supabase", "Web3", "IPFS", "Polygon", "Socket.IO"],
        github: "https://github.com/Gooichand/blockchain-evidence",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["AI/ML", "Smart Contracts", "React", "Security", "Legal Compliance"],
        collaborationDetails: "Help with AI/ML models for deepfake detection and metadata forensics. Improve legal compliance dashboards. Expand court integration features. Any front-end or security enhancements welcome."
    },
    {
        id: "LK2F0",
        title: "LOOK-DGC – Digital Image Forensics Toolkit",
        description: "Open-source forensic toolkit for analyzing digital images to detect tampering, forgery, and manipulation. Provides 50+ analysis tools – from JPEG ghost detection and copy-move forgery to AI-based TruFor tampering analysis. GUI built with Qt/PySide6, supports major image formats, generates PDF reports. Docker setup included.",
        category: "FORENSICS",
        tech: ["Python", "PySide6", "OpenCV", "NumPy", "PyTorch", "Docker"],
        github: "https://github.com/Gooichand/LOOK_DGC",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "Computer Vision", "UI/UX", "Docker", "Research"],
        collaborationDetails: "Add new forensic algorithms from research papers. Improve UI/UX and cross-platform stability. Enhance Docker configurations. Write tutorials or translate documentation."
    },
    {
        id: "CE3R0",
        title: "evid-dgc-certificates – Digital Certificate Management",
        description: "System to issue, verify, and manage digital certificates for evidence handling and user credentials within the EVID-DGC ecosystem. Leverages blockchain to ensure tamper-proof certificate records, enabling trusted identity and qualification verification.",
        category: "BLOCKCHAIN",
        tech: ["Node.js", "Blockchain", "Polygon", "Supabase", "IPFS"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Smart Contracts", "Backend", "Blockchain", "Security"],
        collaborationDetails: "Help define the certificate schema and issuance workflow. Build a public verification portal. Integrate with existing EVID-DGC roles and permissions."
    },
    {
        id: "RK4N0",
        title: "Recon_dgc – Digital Forensics Reconnaissance Toolkit",
        description: "Reconnaissance toolkit tailored for digital forensics investigations. Automates data gathering from various sources (network, system logs, metadata) and structures output for use in evidence management systems like EVID-DGC. Designed to accelerate initial case triage.",
        category: "FORENSICS",
        tech: ["Python", "OSINT", "Log Parsing", "Data Structures"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "OSINT", "Forensics", "Data Processing"],
        collaborationDetails: "Help design modular data collectors. Build connectors to feed evidence directly into EVID-DGC. Expand supported data sources and reporting formats."
    },
    {
        id: "ST5K0",
        title: "STK – Student Toolkit for Forensics & Cybersecurity",
        description: "Toolkit aimed at helping students learn and practice digital forensics and cybersecurity. Includes simplified versions of forensic tools, interactive tutorials, and capture-the-flag style challenges. Goal is to make complex concepts accessible and engaging.",
        category: "EDUCATION",
        tech: ["Python", "Jupyter", "Web Technologies", "Interactive Labs"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Education", "Python", "Web Development", "Gamification"],
        collaborationDetails: "Create educational content (labs, walkthroughs). Build the interactive web interface. Add gamification elements to keep learners engaged."
    },
    {
        id: "PH6X0",
        title: "Phishnix – Browser Extension for Phishing Detection",
        description: "Lightweight Chrome/Edge extension that detects phishing attempts in real time. Analyzes URLs, page content, and visual cues to warn users before they enter sensitive information. Focuses on low-overhead, privacy-preserving detection.",
        category: "SECURITY",
        tech: ["JavaScript", "Browser APIs", "TensorFlow.js", "ML Models"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["JavaScript", "Browser Extensions", "ML/AI", "UI/UX"],
        collaborationDetails: "Improve detection accuracy with better heuristics or ML. Add support for Firefox and Safari. Design the warning UI to be clear and user-friendly. Help with beta testing and feedback collection."
    },
    {
        id: "RB7M0",
        title: "Recycle Bin Metadata Recovery Tool",
        description: "Windows forensic tool that parses Recycle Bin $I metadata files to reconstruct original filenames, deletion timestamps, and file paths. Recovers file information even when content is partially overwritten. Generates detailed CSV reports for forensic analysis and evidence documentation.",
        category: "FORENSICS",
        tech: ["Python", "Binary Parsing", "Windows Forensics", "CSV Export"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "Binary Structures", "Windows Internals", "Forensics"],
        collaborationDetails: "Help enhance metadata extraction algorithms. Add support for different Windows versions. Improve CSV reporting with timeline visualization. Contribute to documentation and test cases."
    },
    {
        id: "BD8H0",
        title: "Browser Download History Mapper",
        description: "Cross-artifact forensic tool that extracts download history from Chrome/Firefox SQLite databases and correlates with file system $MFT records. Verifies file existence, validates hashes, and produces comprehensive download timelines for incident investigation and user activity analysis.",
        category: "FORENSICS",
        tech: ["Python", "SQLite3", "File System Analysis", "Hash Verification"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "SQLite", "File System Forensics", "Data Correlation"],
        collaborationDetails: "Add support for more browsers (Edge, Safari, Opera). Implement advanced hash matching algorithms. Build timeline visualization dashboard. Help with cross-platform compatibility."
    },
    {
        id: "WP9F0",
        title: "Windows Prefetch Parser",
        description: "Advanced Windows forensics tool that analyzes Prefetch files (*.pf) to extract program execution history. Reveals executable names, last run timestamps, execution counts, and loaded DLLs. Essential for incident response and malware analysis investigations.",
        category: "FORENSICS",
        tech: ["Python", "Struct Unpacking", "Windows Forensics", "Binary Analysis"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "Binary Parsing", "Windows Internals", "Forensics"],
        collaborationDetails: "Enhance parsing for Windows 11 Prefetch format. Add DLL dependency mapping. Create execution timeline graphs. Improve performance for bulk analysis."
    },
    {
        id: "LN10A",
        title: "LNK File Analyzer",
        description: "Forensic tool for analyzing Windows shortcut files (.lnk) to extract user activity evidence. Parses binary structure to reveal target paths, network locations, machine IDs, and comprehensive timestamps. Outputs detailed CSV reports showing file access patterns and user behavior.",
        category: "FORENSICS",
        tech: ["Python", "Binary Parsing", "Windows Forensics", "CSV Export"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "Binary Structures", "Windows Forensics", "Data Analysis"],
        collaborationDetails: "Add network share analysis features. Implement timeline visualization. Support batch processing of LNK files. Create integration with other forensic tools."
    },
    {
        id: "EL11T",
        title: "Event Log Triage Tool",
        description: "Command-line forensic utility that filters Windows Event Logs (.evtx) for critical security events. Extracts high-value events like logins (4624), scheduled tasks (4698), and service installations (7045). Produces clean, readable timelines for rapid incident triage and investigation.",
        category: "FORENSICS",
        tech: ["Python", "Evtx Module", "Event Log Analysis", "Security Forensics"],
        github: "",
        live: "",
        openForCollaboration: true,
        skillsNeeded: ["Python", "Windows Event Logs", "Security Analysis", "Incident Response"],
        collaborationDetails: "Add custom event ID filtering rules. Build interactive timeline viewer. Implement anomaly detection for suspicious patterns. Create export formats for SIEM integration."
    },
    
    // OLD PROJECTS - NOW IN VAULT
    {
        id: "BK12V",
        title: "Blockchain Evidence (EVIDv-DGC)",
        description: "Digital forensic evidence management system using blockchain for immutable record-keeping and chain of custody tracking.",
        category: "OWN PROJECT - VAULT",
        tech: ["JavaScript", "React", "Node.js", "Blockchain", "MongoDB"],
        github: "https://github.com/Gooichand/blockchain-evidence",
        live: "https://blockchain-evidence.onrender.com/",
        openForCollaboration: false
    },
    {
        id: "NN13B",
        title: "NeoNest – AI Baby Care",
        description: "AI chatbot providing personalized baby care guidance, tips, and health advice for new parents and caregivers.",
        category: "GSSOC 2025 MENTOR - VAULT",
        tech: ["React", "Node.js", "AI/ML", "Vercel"],
        github: "https://github.com/AditiGupta-tech/neonest",
        live: "https://neonest-babycare.vercel.app/",
        openForCollaboration: false
    },
    {
        id: "EH14S",
        title: "EduHaven – Student Learning",
        description: "Collaborative learning platform with real-time collaboration, task management, AI chatbot, and gamification.",
        category: "GSSOC 2025 MENTOR - VAULT",
        tech: ["React", "Node.js", "WebSockets", "MongoDB"],
        github: "https://github.com/EduHaven/EduHaven",
        live: "https://eduhaven.online/",
        openForCollaboration: false
    },
    {
        id: "PR15D",
        title: "Pouranik – Digital Bookshelf",
        description: "Social reading platform for exploring books, connecting with readers, and building reading communities.",
        category: "GSSOC 2025 MENTOR - VAULT",
        tech: ["React", "Next.js", "Vercel", "Database"],
        github: "https://github.com/BhaktiMore18/Pouranik",
        live: "https://pouranik.vercel.app/",
        openForCollaboration: false
    },
    {
        id: "DN16W",
        title: "DevNotes – Web Development Learning",
        description: "Structured platform covering Frontend, Backend, Deployment with progressive learning paths and tutorials.",
        category: "GSSOC 2025 MENTOR - VAULT",
        tech: ["React", "Next.js", "Markdown", "Vercel"],
        github: "https://github.com/Amarjha01/DevNotes",
        live: "https://devnotes.amarjha.dev/",
        openForCollaboration: false
    },
    {
        id: "OS17C",
        title: "OpenSource Compass",
        description: "Community platform guiding beginners through Git/GitHub basics and open-source programs.",
        category: "SWOC 2026 MENTOR - VAULT",
        tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
        github: "https://github.com/sayeeg-11/OpenSource-Compass",
        live: "https://sayeeg-11.github.io/OpenSource-Compass/",
        openForCollaboration: false
    },
    {
        id: "PP18P",
        title: "Personal Portfolio",
        description: "Professional portfolio showcasing projects, skills, and experience with modern design.",
        category: "OWN PROJECT - VAULT",
        tech: ["HTML", "CSS", "JavaScript", "EmailJS"],
        github: "https://github.com/Gooichand/Gooichand.github.io",
        live: "https://gooichand.github.io/Unknown/",
        openForCollaboration: false
    },
    {
        id: "AP19G",
        title: "AgriPredict",
        description: "Agricultural prediction app helping farmers make data-driven decisions for crop management.",
        category: "OWN PROJECT - VAULT",
        tech: ["TypeScript", "Vercel"],
        github: "https://github.com/Gooichand/AgriPredict",
        live: "https://agri-predict-umber.vercel.app",
        openForCollaboration: false
    },
    {
        id: "CH20K",
        title: "CryptoHub",
        description: "Crypto dashboard for real-time price tracking, market analysis, and portfolio management.",
        category: "ECWOC 2026 MENTOR - VAULT",
        tech: ["React", "Vite", "Crypto APIs", "Vercel"],
        github: "https://github.com/KaranUnique/CryptoHub",
        live: "https://crypto-hub-rosy.vercel.app/",
        openForCollaboration: false
    },
    {
        id: "SP21S",
        title: "SECURITY-PASS-DGC",
        description: "Security pass management system for managing and verifying security passes and credentials.",
        category: "OWN PROJECT - VAULT",
        tech: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/Gooichand/SECURITY-PASS-DGC",
        live: "https://gooichand.github.io/SECURITY-PASS-DGC/",
        openForCollaboration: false
    }
];
