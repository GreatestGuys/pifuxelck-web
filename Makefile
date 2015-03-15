NAMESPACE=pifuxelck

SRC_DIR=src
OUT_DIR=out
DEPLOY_DIR=${OUT_DIR}/deploy
GEN_DIR=${OUT_DIR}/intermediate
THIRD_PARTY=third_party
CSS_DIR=${SRC_DIR}/css
HTML_DIR=${SRC_DIR}/html
JS_DIR=${SRC_DIR}/js
EXTERN_DIR=externs/

SRCS_JS=$(shell find ${JS_DIR} -name '*.js')
SRCS_CSS=$(shell find ${CSS_DIR} -name '*.scss')
SRCS_HTML=$(shell find ${HTML_DIR} -name '*.html')

EXTERNS_FLAGS=`echo ${EXTERN_DIR}/*.js | sed -r 's/(^| )/\1--compiler_flags=--externs=/g'`

DEPLOY_JS=${GEN_DIR}/pifuxelck.js
DEPLOY_CSS=${GEN_DIR}/styles.css

CLOSURE_ROOT=${THIRD_PARTY}/closure-library/
CLOSURE_BUILDER=python ${CLOSURE_ROOT}/closure/bin/build/closurebuilder.py
CLOSURE_COMPILER=${THIRD_PARTY}/closure-compiler/compiler.jar

SCSS=${THIRD_PARTY}/sass/bin/scss

# If the ${DEBUG} environment variable is set, then build in script mode.
# Otherwise, build in optimized mode.
COMPILE_MODE=`if [ "${DEBUG}" ]; then echo 'script'; else echo 'compiled'; fi`

deploy : ${DEPLOY_DIR}

# Generates a directory structure in ${DEPLOY_DIR} that can be deployed to the
# HTTP server that hosts the app.
${DEPLOY_DIR} : ${DEPLOY_JS} ${DEPLOY_CSS} ${SRCS_HTML}
	@mkdir -p ${DEPLOY_DIR}
	@cp ${DEPLOY_JS} ${DEPLOY_DIR}
	@cp ${DEPLOY_CSS} ${DEPLOY_DIR}
	@cp -R ${HTML_DIR}/* ${DEPLOY_DIR}

${DEPLOY_JS} : ${SRCS_JS}
	@mkdir -p ${GEN_DIR}
	@${CLOSURE_BUILDER} \
					--root=${CLOSURE_ROOT} \
					--root=${JS_DIR} \
					--namespace=${NAMESPACE} \
					--output_mode=${COMPILE_MODE} \
					--compiler_flags=--warning_level=VERBOSE \
					--compiler_flags=--compilation_level=ADVANCED_OPTIMIZATIONS \
					--compiler_flags=--closure_entry_point=${NAMESPACE} \
					--compiler_jar=${CLOSURE_COMPILER} > ${DEPLOY_JS}
# Add the following to the above flags if/when we have externs...
#					${EXTERNS_FLAGS} \

${DEPLOY_CSS} : ${SRCS_CSS}
	@mkdir -p ${GEN_DIR}
	@scss ${SRCS_CSS} > ${DEPLOY_CSS}

clean :
	@rm -Rf ${OUT_DIR}
