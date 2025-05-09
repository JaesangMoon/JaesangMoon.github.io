#version 300 es

precision highp float;

out vec4 FragColor;
in vec3 fragPos;  
in vec3 normal;  
in vec2 texCoord;

struct Material {
    sampler2D diffuse; // diffuse map
    vec3 specular;     // 표면의 specular color
    float shininess;   // specular 반짝임 정도
};

struct Light {
    //vec3 position;
    vec3 direction;
    vec3 ambient; // ambient 적용 strength
    vec3 diffuse; // diffuse 적용 strength
    vec3 specular; // specular 적용 strength
};

uniform Material material;
uniform Light light;
uniform vec3 u_viewPos;
uniform int u_toonLevel; // TOON: 계단화 레벨

void main() {
    // ambient
    //vec3 rgb = texture(material.diffuse, texCoord).rgb;
    vec3 rgb = vec3(0.8, 0.4, 0.0);
    vec3 ambient = light.ambient * rgb;
  	
    // diffuse 
    vec3 norm = normalize(normal);
    //vec3 lightDir = normalize(light.position - fragPos);
    vec3 lightDir = normalize(light.direction);
    float dotNormLight = dot(norm, lightDir);
    float diff = max(dotNormLight, 0.0);
    vec3 diffuse = light.diffuse * diff * rgb;  
    
    // specular
    vec3 viewDir = normalize(u_viewPos - fragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = 0.0;
    if (dotNormLight > 0.0) {
        spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    }
    vec3 specular = light.specular * spec * material.specular;
    
    //vec3 result = ambient;


    // TOON: diffuse + specular을 계단화, u_toonLevel이 1일 경우 그대로 사용
    vec3 lightPart = ambient + diffuse + specular;

    if (u_toonLevel <= 1) {
        // 단계가 1이면 계단화 없이 원래 값 사용
        lightPart = ambient;
    } else {
        // 단계가 2 이상이면 계단화 수행
        lightPart = floor(lightPart * float(u_toonLevel)) / float(u_toonLevel - 1);
    }

    // 최종 색상 조합
    vec3 result = lightPart;
    FragColor = vec4(result, 1.0);
} 