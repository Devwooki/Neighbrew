FROM adoptopenjdk/openjdk11

COPY ./build/libs/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar

EXPOSE 9999

ENTRYPOINT [ "java" ,"-jar", "backend-0.0.1-SNAPSHOT.jar"]