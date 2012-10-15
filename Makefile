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
	bundle
	xvfb-run bundle exec rake jasmine:ci
