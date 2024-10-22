FROM openjdk:11
EXPOSE 8080
ADD target/readify.jar readify.jar
ENTRYPOINT ["java", "-jar", "/readify.jar"]