.PHONY: all serve

all: serve

# Serve website locally
serve:
	npx http-server web/ -o index.html
