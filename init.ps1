Remove-Item -Recurse -Force discovery-server, api-gateway, auth-service, user-service, event-service, ticket-service -ErrorAction SilentlyContinue

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=cloud-eureka-server" -d "groupId=com.eventsphere" -d "artifactId=discovery-server" -d "name=discovery-server" -d "javaVersion=17" -o discovery-server.zip
Expand-Archive discovery-server.zip -DestinationPath discovery-server -Force
Remove-Item discovery-server.zip

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=cloud-gateway,cloud-eureka,lombok" -d "groupId=com.eventsphere" -d "artifactId=api-gateway" -d "name=api-gateway" -d "javaVersion=17" -o api-gateway.zip
Expand-Archive api-gateway.zip -DestinationPath api-gateway -Force
Remove-Item api-gateway.zip

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=web,data-jpa,mysql,cloud-eureka,lombok,validation" -d "groupId=com.eventsphere" -d "artifactId=auth-service" -d "name=auth-service" -d "javaVersion=17" -o auth-service.zip
Expand-Archive auth-service.zip -DestinationPath auth-service -Force
Remove-Item auth-service.zip

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=web,data-jpa,mysql,cloud-eureka,lombok,validation" -d "groupId=com.eventsphere" -d "artifactId=user-service" -d "name=user-service" -d "javaVersion=17" -o user-service.zip
Expand-Archive user-service.zip -DestinationPath user-service -Force
Remove-Item user-service.zip

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=web,data-jpa,mysql,cloud-eureka,lombok,validation" -d "groupId=com.eventsphere" -d "artifactId=event-service" -d "name=event-service" -d "javaVersion=17" -o event-service.zip
Expand-Archive event-service.zip -DestinationPath event-service -Force
Remove-Item event-service.zip

curl.exe "https://start.spring.io/starter.zip" -d "type=maven-project" -d "dependencies=web,data-jpa,mysql,cloud-eureka,cloud-feign,lombok,validation" -d "groupId=com.eventsphere" -d "artifactId=ticket-service" -d "name=ticket-service" -d "javaVersion=17" -o ticket-service.zip
Expand-Archive ticket-service.zip -DestinationPath ticket-service -Force
Remove-Item ticket-service.zip
