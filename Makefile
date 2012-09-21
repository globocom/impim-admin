all: help

help:
	@echo -n $(blue)
	@echo 'USO: make <target>'
	@echo -n $(normal)
	@echo '-------'
	@echo 'Targets'
	@echo '-------'
	@echo '    ci ................................. executa CI'

ci:
	rvm info
	bundle
	rake jasmine:ci
    