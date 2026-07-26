setup_project() {
    for agent in .codex .claude; do
        echo "• Preparing $agent"

        rm -rf "$agent/skills"

        echo "• Copying skills -> $agent/"
        cp -a .mipe/skills "$agent/"
    done
}
