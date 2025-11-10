#!/usr/bin/env python3
"""Check Docker availability for ray-agents."""

import sys

def check_docker_package():
    """Check if docker Python package is installed."""
    try:
        import docker
        print(f"✓ docker Python package installed (version {docker.__version__})")
        return True
    except ImportError as e:
        print(f"✗ docker Python package not found: {e}")
        return False

def check_docker_daemon():
    """Check if Docker daemon is accessible."""
    try:
        import docker
        client = docker.from_env()
        info = client.info()
        print(f"✓ Docker daemon accessible (version {info['ServerVersion']})")
        print(f"  - Containers running: {info['ContainersRunning']}")
        print(f"  - Images: {info['Images']}")
        return True
    except Exception as e:
        print(f"✗ Docker daemon not accessible: {e}")
        return False

def check_ray_agents():
    """Check if ray-agents is installed with code-interpreter module."""
    try:
        from ray_agents.code_interpreter import execute_code, install_package, upload_file
        print("✓ ray-agents code_interpreter module available")
        print(f"  - Functions: execute_code, install_package, upload_file")
        return True
    except ImportError as e:
        print(f"✗ ray-agents code_interpreter module not available: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Docker Availability Check")
    print("=" * 60)

    checks = [
        check_docker_package(),
        check_docker_daemon(),
        check_ray_agents(),
    ]

    print("\n" + "=" * 60)
    if all(checks):
        print("✓ All checks passed - Docker is ready for ray-agents")
        sys.exit(0)
    else:
        print("✗ Some checks failed - see errors above")
        print("\nTo fix:")
        print("  1. Ensure Docker Desktop is running")
        print("  2. Run: make sync  (or: uv sync)")
        print("  3. Ensure ray-agents[code-interpreter] is installed")
        sys.exit(1)
