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
	
	xvfb-run rake jasmine:ci
	
	git checkout master
	git pull
	git push git@ngit.globoi.com:images-project/images-admin.git master
