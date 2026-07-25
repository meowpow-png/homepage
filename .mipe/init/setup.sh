setup_project() {
    for agent in .codex .claude; do
        echo "• Preparing $agent"
        mkdir -p "$agent"

        find .mipe -maxdepth 1 -name 'skills*' | while read -r skill; do
            echo "• Copying $(basename "$skill") -> $agent/"
            cp -a "$skill" "$agent/"
        done
    done
}
