FROM node

RUN mkdir /src
WORKDIR /src

ADD app/ /src/app
ADD package.json /src
RUN npm i npm@latest -g \
&& npm install \
&& npm install -g apidoc \
&& cd /src/app/ 
RUN mkdir apidoc
RUN apidoc -i ./app/ -o ./app/apidoc/ -e ./app/apidoc/

EXPOSE 80

CMD npm start
