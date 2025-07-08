import { PrismaClient, ComponentCategory } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Début du seed de la base de données...');

        // ------------------------------------------------------------------------
        // 1. Utilisateurs
        // ------------------------------------------------------------------------
        console.log('📝 Création des utilisateurs...');

        const admin = await prisma.user.upsert({
            where: { email: 'admin@smartfarm.local' },
            update: {},
            create: {
                email: 'admin@smartfarm.local',
                passwordHash: await hashPassword('admin1234'),
                firstName: 'Super',
                lastName: 'Admin',
                role: 'admin',
                isActive: true,
            },
        });

        const userCM = await prisma.user.upsert({
            where: { email: 'martin.ndongo@farm.cm' },
            update: {},
            create: {
                email: 'martin.ndongo@farm.cm',
                passwordHash: await hashPassword('cm123456'),
                firstName: 'Martin',
                lastName: 'Ndongo',
                role: 'user',
                isActive: true,
            },
        });

        console.log(`✅ Utilisateurs créés: ${admin.email}, ${userCM.email}`);

        // ------------------------------------------------------------------------
        // 2. Device ESP32 (identique au sketch)
        // ------------------------------------------------------------------------
        console.log('🔧 Création du device ESP32...');

        const device = await prisma.ioTDevice.upsert({
            where: { identifier: 'esp32-farm-001' },
            update: {},
            create: {
                identifier: 'esp32-farm-001',
                deviceType: 'esp32',
                model: 'ESP32 DevKit',
                metadata: {
                    firmware: '1.0',
                    tags: ['esp32', 'prototype'],
                    ip: null,
                    location: 'Ferme principale',
                    installDate: new Date().toISOString()
                },
                active: true,
                createdBy: admin.userId,
            },
        });

        console.log(`✅ Device créé: ${device.identifier}`);

        // ------------------------------------------------------------------------
        // 3. Types de composants (capteurs + actionneurs)
        // ------------------------------------------------------------------------
        console.log('🔩 Création des types de composants...');

        const componentTypesData: { name: string; identifier: string; category: ComponentCategory; unit: string; description: string; createdBy: number; }[] = [
            { name: 'LED', identifier: 'led', category: ComponentCategory.actuator, unit: '', description: 'Actionneur LED générique', createdBy: admin.userId },
            { name: 'Servomoteur S390', identifier: 'servo_s390', category: ComponentCategory.actuator, unit: 'degrees', description: 'Servomoteur S390', createdBy: admin.userId },
            { name: 'Température ambiante', identifier: 'temperature', category: ComponentCategory.sensor, unit: '°C', description: 'Capteur DHT11 - température', createdBy: admin.userId },
            { name: 'Humidité ambiante', identifier: 'humidity', category: ComponentCategory.sensor, unit: '%', description: 'Capteur DHT11 - humidité', createdBy: admin.userId },
            { name: 'Température de l\'eau', identifier: 'water_temp', category: ComponentCategory.sensor, unit: '°C', description: 'Capteur DS18B20', createdBy: admin.userId },
            { name: 'Niveau d\'eau', identifier: 'water_level', category: ComponentCategory.sensor, unit: '%', description: 'Capteur de niveau d\'eau', createdBy: admin.userId },
            { name: 'Luminosité', identifier: 'lux', category: ComponentCategory.sensor, unit: 'lux', description: 'Capteur LDR', createdBy: admin.userId },
            { name: 'Mouvement', identifier: 'motion', category: ComponentCategory.sensor, unit: 'boolean', description: 'Capteur PIR', createdBy: admin.userId },
        ];

        const componentTypes: Record<string, any> = {};
        for (const data of componentTypesData) {
            try {
                const ct = await prisma.componentType.upsert({
                    where: { identifier: data.identifier },
                    update: {},
                    create: data,
                });
                componentTypes[data.identifier] = ct;
                console.log(`  ✓ Type de composant créé: ${data.name}`);
            } catch (error) {
                console.error(`  ❌ Erreur lors de la création du type ${data.name}:`, error);
                throw error;
            }
        }

        // ------------------------------------------------------------------------
        // 4. Déploiements + connexion des pins
        // ------------------------------------------------------------------------
        console.log('🔌 Création des déploiements et connexions des pins...');

        const deploymentsData = [
            // Capteurs
            { key: 'temperature', type: 'temperature', pin: 'GPIO4', pinFunction: 'data' },
            { key: 'humidity', type: 'humidity', pin: 'GPIO4', pinFunction: 'data' },
            { key: 'water_temp', type: 'water_temp', pin: 'GPIO18', pinFunction: 'onewire' },
            { key: 'water_level', type: 'water_level', pin: 'GPIO34', pinFunction: 'analog' },
            { key: 'lux', type: 'lux', pin: 'GPIO35', pinFunction: 'analog' },
            { key: 'motion', type: 'motion', pin: 'GPIO5', pinFunction: 'digital' },
            // Actionneurs
            { key: 'light', type: 'led', pin: 'GPIO27', pinFunction: 'digital_out' },
            { key: 'fan1', type: 'led', pin: 'GPIO26', pinFunction: 'digital_out' },
            { key: 'pump', type: 'led', pin: 'GPIO25', pinFunction: 'digital_out' },
            { key: 'fan2', type: 'led', pin: 'GPIO33', pinFunction: 'digital_out' },
            { key: 'feeder', type: 'led', pin: 'GPIO32', pinFunction: 'digital_out' },
            { key: 'servo', type: 'servo_s390', pin: 'GPIO14', pinFunction: 'pwm' },
        ];

        const deployments: Record<string, any> = {};
        for (const d of deploymentsData) {
            try {
                // Vérifier que le type de composant existe
                if (!componentTypes[d.type]) {
                    throw new Error(`Type de composant '${d.type}' non trouvé`);
                }

                const dep = await prisma.componentDeployment.create({
                    data: {
                        componentTypeId: componentTypes[d.type].componentTypeId,
                        deviceId: device.deviceId,
                        active: true,
                        createdBy: admin.userId,
                    },
                });
                deployments[d.key] = dep;

                await prisma.componentPinConnection.create({
                    data: {
                        deploymentId: dep.deploymentId,
                        pinIdentifier: d.pin,
                        pinFunction: d.pinFunction,
                    },
                });

                console.log(`  ✓ Déploiement créé: ${d.key} (${d.type}) sur ${d.pin}`);
            } catch (error) {
                console.error(`  ❌ Erreur lors du déploiement ${d.key}:`, error);
                throw error;
            }
        }

        // ------------------------------------------------------------------------
        // 5. Zones
        // ------------------------------------------------------------------------
        console.log('🏗️ Création des zones...');

        const zoneMain = await prisma.zone.upsert({
            where: { zoneId: 1 },
            update: {},
            create: {
                name: 'Ferme Principale',
                description: 'Zone générale du dispositif',
                metadata: {
                    location: 'Bâtiment',
                    level: 1,
                    area: 'main',
                    capacity: 100
                },
                createdBy: admin.userId,
            },
        });

        const zoneSub = await prisma.zone.upsert({
            where: { zoneId: 2 },
            update: {},
            create: {
                name: 'Enclos Intérieur',
                description: 'Zone intérieure de la ferme',
                parentZoneId: zoneMain.zoneId,
                metadata: {
                    area: 'indoor',
                    capacity: 50
                },
                createdBy: admin.userId,
            },
        });

        console.log(`✅ Zones créées: ${zoneMain.name}, ${zoneSub.name}`);

        // Affectation des déploiements à la bonne zone
        console.log('📍 Affectation des déploiements aux zones...');

        const sensorKeys = ['temperature', 'humidity', 'water_temp', 'water_level', 'lux', 'motion'];
        for (const [key, deployment] of Object.entries(deployments)) {
            try {
                const zoneId = sensorKeys.includes(key) ? zoneSub.zoneId : zoneMain.zoneId;
                await prisma.zoneComponentDeployment.upsert({
                    where: {
                        zoneId_deploymentId: {
                            zoneId,
                            deploymentId: deployment.deploymentId
                        }
                    },
                    update: {},
                    create: {
                        zoneId,
                        deploymentId: deployment.deploymentId,
                        assignedBy: admin.userId,
                    },
                });
                console.log(`  ✓ ${key} assigné à la zone ${sensorKeys.includes(key) ? 'Enclos Intérieur' : 'Ferme Principale'}`);
            } catch (error) {
                console.error(`  ❌ Erreur lors de l'affectation ${key}:`, error);
                throw error;
            }
        }

        // ------------------------------------------------------------------------
        // 6. Règles d'automatisation
        // ------------------------------------------------------------------------
        console.log('🤖 Création des règles d\'automatisation...');

        const automationRules = [
            {
                name: 'Ventilation température',
                description: 'Active le ventilateur principal si température > 35 °C',
                sensorKey: 'temperature',
                operator: 'gt',
                thresholdValue: 35,
                actionType: 'trigger_actuator',
                targetKey: 'fan1',
                actuatorCommand: 'ON',
                actuatorParameters: { reason: 'high_temperature' },
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Ventilation humidité',
                description: 'Active le ventilateur secondaire si humidité > 70 %',
                sensorKey: 'humidity',
                operator: 'gt',
                thresholdValue: 70,
                actionType: 'trigger_actuator',
                targetKey: 'fan2',
                actuatorCommand: 'ON',
                actuatorParameters: { reason: 'high_humidity' },
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Éclairage automatique',
                description: "Allume l'éclairage principal si luminosité < 200 lux",
                sensorKey: 'lux',
                operator: 'lt',
                thresholdValue: 200,
                actionType: 'trigger_actuator',
                targetKey: 'light',
                actuatorCommand: 'ON',
                actuatorParameters: { reason: 'low_light', schedule: '6h-20h' },
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Remplissage réservoir',
                description: 'Active la pompe si niveau d\'eau < 30 %',
                sensorKey: 'water_level',
                operator: 'lt',
                thresholdValue: 30,
                actionType: 'trigger_actuator',
                targetKey: 'pump',
                actuatorCommand: 'ON',
                actuatorParameters: { reason: 'low_water_level' },
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Alerte niveau eau bas',
                description: 'Déclenche une alerte si niveau d\'eau < 30 %',
                sensorKey: 'water_level',
                operator: 'lt',
                thresholdValue: 30,
                actionType: 'create_alert',
                alertTitle: 'Niveau d\'eau bas',
                alertMessage: 'Le niveau d\'eau du réservoir est inférieur à 30 %',
                alertSeverity: 'warning',
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Alerte intrusion',
                description: 'Déclenche une alerte critique en cas de mouvement nocturne',
                sensorKey: 'motion',
                operator: 'eq',
                thresholdValue: 1,
                actionType: 'create_alert',
                alertTitle: 'Intrusion détectée',
                alertMessage: 'Un mouvement a été détecté dans la zone intérieure',
                alertSeverity: 'critical',
                isActive: true,
                cooldownMinutes: 5,
            },
            {
                name: 'Éclairage sécurité',
                description: 'Allume l\'éclairage si mouvement détecté',
                sensorKey: 'motion',
                operator: 'eq',
                thresholdValue: 1,
                actionType: 'trigger_actuator',
                targetKey: 'light',
                actuatorCommand: 'ON',
                actuatorParameters: { reason: 'security_motion' },
                isActive: true,
                cooldownMinutes: 5,
            },
        ];

        for (const rule of automationRules) {
            try {
                // Vérifier que les déploiements existent
                if (!deployments[rule.sensorKey]) {
                    throw new Error(`Déploiement capteur '${rule.sensorKey}' non trouvé`);
                }

                const ruleData: any = {
                    name: rule.name,
                    description: rule.description,
                    sensorDeploymentId: deployments[rule.sensorKey].deploymentId,
                    operator: rule.operator,
                    thresholdValue: rule.thresholdValue,
                    actionType: rule.actionType,
                    isActive: rule.isActive,
                    cooldownMinutes: rule.cooldownMinutes,
                    createdBy: admin.userId,
                };

                // Ajouter les champs spécifiques selon le type d'action
                if (rule.actionType === 'trigger_actuator') {
                    if (!rule.targetKey || !deployments[rule.targetKey]) {
                        throw new Error(`Déploiement actuateur '${rule.targetKey}' non trouvé`);
                    }
                    ruleData.targetDeploymentId = deployments[rule.targetKey].deploymentId;
                    ruleData.actuatorCommand = rule.actuatorCommand;
                    ruleData.actuatorParameters = rule.actuatorParameters || {};
                } else if (rule.actionType === 'create_alert') {
                    ruleData.alertTitle = rule.alertTitle;
                    ruleData.alertMessage = rule.alertMessage;
                    ruleData.alertSeverity = rule.alertSeverity;
                }

                await prisma.automationRule.create({
                    data: ruleData,
                });

                console.log(`  ✓ Règle créée: ${rule.name}`);
            } catch (error) {
                console.error(`  ❌ Erreur lors de la création de la règle ${rule.name}:`, error);
                throw error;
            }
        }

        // ------------------------------------------------------------------------
        console.log('🎉 Seed terminé avec succès!');
        console.log(`👤 Admin: ${admin.email}`);
        console.log(`👤 Utilisateur CM: ${userCM.email}`);
        console.log(`🔧 Device: ${device.identifier}`);
        console.log(`📊 Types de composants: ${Object.keys(componentTypes).length}`);
        console.log(`🔌 Déploiements: ${Object.keys(deployments).length}`);
        console.log(`🏗️ Zones: 2`);
        console.log(`🤖 Règles d'automatisation: ${automationRules.length}`);

    } catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('💥 Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Connexion Prisma fermée');
    });