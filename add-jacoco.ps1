$jacocoPlugin = @"
			<plugin>
				<groupId>org.jacoco</groupId>
				<artifactId>jacoco-maven-plugin</artifactId>
				<version>0.8.11</version>
				<executions>
					<execution>
						<goals>
							<goal>prepare-agent</goal>
						</goals>
					</execution>
					<execution>
						<id>report</id>
						<phase>prepare-package</phase>
						<goals>
							<goal>report</goal>
						</goals>
					</execution>
				</executions>
			</plugin>
			<plugin>
				<groupId>org.sonarsource.scanner.maven</groupId>
				<artifactId>sonar-maven-plugin</artifactId>
				<version>3.10.0.2594</version>
			</plugin>
		</plugins>
"@

Get-ChildItem -Path . -Filter pom.xml -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    # Only replace if not already replaced
    if ($content -notmatch "jacoco-maven-plugin") {
        $content = $content -replace "</plugins>", $jacocoPlugin
        Set-Content -Path $_.FullName -Value $content
        Write-Host "Updated $($_.FullName)"
    }
}
